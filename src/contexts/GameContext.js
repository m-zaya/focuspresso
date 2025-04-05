import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskContext } from './TaskContext';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { completedTasks } = useContext(TaskContext);
  
  const [character, setCharacter] = useState({
    level: 1,
    experience: 0,
    accessories: [],
    pets: [],
    unlockedItems: []
  });
  
  const [dailyChallenge, setDailyChallenge] = useState({
    challenge: null,
    lastUpdated: null,
    completed: false
  });

  // Load game data from storage on app start
  useEffect(() => {
    const loadGameData = async () => {
      try {
        const characterData = await AsyncStorage.getItem('character');
        const challengeData = await AsyncStorage.getItem('dailyChallenge');
        
        if (characterData) setCharacter(JSON.parse(characterData));
        if (challengeData) setDailyChallenge(JSON.parse(challengeData));
      } catch (error) {
        console.log('Error loading game data from storage:', error);
      }
    };

    loadGameData();
  }, []);

  // Save game data to storage whenever it changes
  useEffect(() => {
    const saveGameData = async () => {
      try {
        await AsyncStorage.setItem('character', JSON.stringify(character));
        await AsyncStorage.setItem('dailyChallenge', JSON.stringify(dailyChallenge));
      } catch (error) {
        console.log('Error saving game data to storage:', error);
      }
    };

    saveGameData();
  }, [character, dailyChallenge]);

  // Update experience and level when tasks are completed
  useEffect(() => {
    // Add 10 XP per completed task
    const newExperience = character.experience + 10;
    
    // Level up if enough XP (100 XP per level)
    let newLevel = character.level;
    if (newExperience >= character.level * 100) {
      newLevel += 1;
      // Unlock new items on level up
      unlockItemsForLevel(newLevel);
    }
    
    setCharacter(prev => ({
      ...prev,
      experience: newExperience,
      level: newLevel
    }));
  }, [completedTasks.length]);

  // Check and update daily challenge
  useEffect(() => {
    const checkDailyChallenge = () => {
      const today = new Date().toDateString();
      
      // If no challenge or challenge is from a previous day, create a new one
      if (!dailyChallenge.lastUpdated || dailyChallenge.lastUpdated !== today) {
        const challenges = [
          'Complete 3 tasks in a row without a break',
          'Complete a task within 30 minutes of adding it',
          'Complete 5 tasks today',
          'Add and complete a difficult task'
        ];
        
        setDailyChallenge({
          challenge: challenges[Math.floor(Math.random() * challenges.length)],
          lastUpdated: today,
          completed: false
        });
      }
    };

    checkDailyChallenge();
  }, []);

  // Unlock items based on level
  const unlockItemsForLevel = (level) => {
    const levelRewards = {
      2: { type: 'accessory', id: 'hat1', name: 'Basic Hat' },
      3: { type: 'pet', id: 'pet1', name: 'Pixel Puppy' },
      5: { type: 'accessory', id: 'glasses1', name: 'Cool Glasses' },
      7: { type: 'pet', id: 'pet2', name: 'Digital Cat' },
      10: { type: 'house', id: 'house1', name: 'Starter House' }
    };

    if (levelRewards[level]) {
      setCharacter(prev => ({
        ...prev,
        unlockedItems: [...prev.unlockedItems, levelRewards[level]]
      }));
    }
  };

  // Complete daily challenge
  const completeDailyChallenge = () => {
    setDailyChallenge(prev => ({
      ...prev,
      completed: true
    }));
    
    // Reward for completing daily challenge
    setCharacter(prev => ({
      ...prev,
      experience: prev.experience + 50
    }));
  };

  // Equip an accessory to the character
  const equipAccessory = (accessoryId) => {
    const accessory = character.unlockedItems.find(
      item => item.id === accessoryId && item.type === 'accessory'
    );
    
    if (accessory) {
      setCharacter(prev => ({
        ...prev,
        accessories: [...prev.accessories, accessory]
      }));
    }
  };

  // Adopt a pet
  const adoptPet = (petId) => {
    const pet = character.unlockedItems.find(
      item => item.id === petId && item.type === 'pet'
    );
    
    if (pet) {
      setCharacter(prev => ({
        ...prev,
        pets: [...prev.pets, pet]
      }));
    }
  };

  return (
    <GameContext.Provider
      value={{
        character,
        dailyChallenge,
        completeDailyChallenge,
        equipAccessory,
        adoptPet
      }}
    >
      {children}
    </GameContext.Provider>
  );
};