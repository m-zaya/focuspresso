import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { GameContext } from '../contexts/GameContext';

const CharacterScreen = () => {
  const { character, equipAccessory } = useContext(GameContext);

  // Placeholder for character image
  const characterImage = '🧙'; // Replace with actual image component in production

  // Filter accessories and pets from unlocked items
  const accessories = character.unlockedItems.filter(item => item.type === 'accessory');
  const pets = character.unlockedItems.filter(item => item.type === 'pet');

  return (
    <ScrollView style={styles.container}>
      {/* Character Display */}
      <View style={styles.characterContainer}>
        <View style={styles.characterImageContainer}>
          <Text style={styles.characterImage}>{characterImage}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <Text style={styles.levelText}>Level {character.level}</Text>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${(character.experience % 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.expText}>
            {character.experience % 100}/100 XP to next level
          </Text>
          <Text style={styles.totalExpText}>
            Total XP: {character.experience}
          </Text>
        </View>
      </View>

      {/* Equipped Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Equipped Items</Text>
        {character.accessories.length > 0 ? (
          <View style={styles.itemsGrid}>
            {character.accessories.map(item => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemIcon}>
                  <Text style={styles.itemEmoji}>🎩</Text>
                </View>
                <Text style={styles.itemName}>{item.name}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No items equipped</Text>
        )}
      </View>

      {/* Available Accessories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Accessories</Text>
        {accessories.length > 0 ? (
          <View style={styles.itemsGrid}>
            {accessories.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.itemCard}
                onPress={() => equipAccessory(item.id)}
              >
                <View style={styles.itemIcon}>
                  <Text style={styles.itemEmoji}>🎩</Text>
                </View>
                <Text style={styles.itemName}>{item.name}</Text>
                <TouchableOpacity style={styles.equipButton}>
                  <Text style={styles.equipButtonText}>Equip</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No accessories unlocked yet</Text>
        )}
      </View>

      {/* Pets */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Pets</Text>
        {character.pets.length > 0 ? (
          <View style={styles.itemsGrid}>
            {character.pets.map(pet => (
              <View key={pet.id} style={styles.itemCard}>
                <View style={styles.itemIcon}>
                  <Text style={styles.itemEmoji}>🐶</Text>
                </View>
                <Text style={styles.itemName}>{pet.name}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No pets adopted yet</Text>
        )}
      </View>

      {/* Available Pets */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Pets</Text>
        {pets.length > 0 ? (
          <View style={styles.itemsGrid}>
            {pets.map(pet => (
              <TouchableOpacity 
                key={pet.id} 
                style={styles.itemCard}
                onPress={() => adoptPet(pet.id)}
              >
                <View style={styles.itemIcon}>
                  <Text style={styles.itemEmoji}>🐶</Text>
                </View>
                <Text style={styles.itemName}>{pet.name}</Text>
                <TouchableOpacity style={styles.equipButton}>
                  <Text style={styles.equipButtonText}>Adopt</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No pets available yet</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  characterContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  characterImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#f0e6ff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  characterImage: {
    fontSize: 40,
  },
  statsContainer: {
    flex: 1,
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#9370DB',
  },
  expText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  totalExpText: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    marginTop: 0,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#f0e6ff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemEmoji: {
    fontSize: 24,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  equipButton: {
    backgroundColor: '#9370DB',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  equipButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
  },
});

export default CharacterScreen;