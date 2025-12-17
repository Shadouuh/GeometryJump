<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate(
            [
                'username' => ['required', 'string', 'min:3'],
                'email' => ['required', 'email', 'unique:users,email'],
                'password' => ['required', 'string', 'min:6'],
            ],
            [
                'username.required' => 'El nombre de usuario es obligatorio',
                'username.min' => 'El nombre de usuario debe tener al menos 3 caracteres',
                'email.required' => 'El email es obligatorio',
                'email.email' => 'El email no tiene un formato válido',
                'email.unique' => 'El email ya existe',
                'password.required' => 'La contraseña es obligatoria',
                'password.min' => 'La contraseña debe tener al menos 6 caracteres',
            ]
        );

        $user = User::create([
            'name' => trim($data['username']),
            'email' => trim($data['email']),
            'password' => Hash::make($data['password']),
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'username' => $user->name,
                'email' => $user->email,
            ],
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'password' => ['required', 'string'],
            'username' => ['sometimes', 'string', 'min:3', 'required_without:email'],
            'email' => ['sometimes', 'email', 'required_without:username'],
        ], [
            'username.required_without' => 'Debes ingresar usuario o email',
            'email.required_without' => 'Debes ingresar usuario o email',
        ]);

        $credentials = [];

        if ($request->filled('email')) {
            $credentials = [
                'email' => $request->input('email'),
                'password' => $request->input('password'),
            ];
        } elseif ($request->filled('username')) {
            $credentials = [
                'name' => $request->input('username'),
                'password' => $request->input('password'),
            ];
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Debes ingresar usuario o email',
                'errors' => ['username' => ['Debes ingresar usuario o email']],
            ], 422);
        }

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales inválidas',
            ], 401);
        }

        $request->session()->regenerate();

        $user = Auth::user();

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'username' => $user->name,
                'email' => $user->email,
            ],
        ], 200);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['success' => true]);
    }

    public function me(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        return response()->json([
            'id' => $user->id,
            'username' => $user->name,
            'email' => $user->email,
        ]);
    }
}
