// Servicio de personajes
const CHARACTERS = [
  {
    id: 'boxy',
    name: 'Boxy',
    type: 'square',
    color: '#8b5cf6', // Violeta
    description: 'Un cuadrado valiente y equilibrado',
    stats: { speed: 5, jump: 5 }
  },
  {
    id: 'gordo',
    name: 'Gordo',
    type: 'circle',
    color: '#06b6d4', // Cyan
    description: 'Un círculo robusto y resistente',
    stats: { speed: 3, jump: 4 }
  },
  {
    id: 'isquio',
    name: 'Isquio',
    type: 'isosceles',
    color: '#a855f7', // Púrpura
    description: 'Un triángulo isósceles preciso',
    stats: { speed: 6, jump: 7 }
  }
];

class CharacterService {
  constructor() {
    this.selectedCharacter = this.loadSelectedCharacter();
  }

  loadSelectedCharacter() {
    const charId = localStorage.getItem('selectedCharacter');
    return charId ? CHARACTERS.find(c => c.id === charId) || CHARACTERS[0] : CHARACTERS[0];
  }

  saveSelectedCharacter(characterId) {
    localStorage.setItem('selectedCharacter', characterId);
    this.selectedCharacter = CHARACTERS.find(c => c.id === characterId);
  }

  getAllCharacters() {
    return CHARACTERS;
  }

  getCharacterById(id) {
    return CHARACTERS.find(c => c.id === id);
  }

  getSelectedCharacter() {
    return this.selectedCharacter;
  }

  selectCharacter(characterId) {
    this.saveSelectedCharacter(characterId);
    return this.selectedCharacter;
  }
}

export default new CharacterService();
