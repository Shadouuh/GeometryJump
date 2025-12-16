import { useState, useEffect } from 'react';
import characterService from '../services/characterService';

export const useCharacter = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(
    characterService.getSelectedCharacter()
  );
  const [allCharacters] = useState(characterService.getAllCharacters());

  const selectCharacter = (characterId) => {
    const char = characterService.selectCharacter(characterId);
    setSelectedCharacter(char);
  };

  return {
    selectedCharacter,
    allCharacters,
    selectCharacter
  };
};
