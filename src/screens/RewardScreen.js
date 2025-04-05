import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { GameContext } from '../contexts/GameContext';
import { TaskContext } from '../contexts/TaskContext';

const RewardsScreen = () => {
  const { character } = useContext(GameContext);
  const { completedTasks } = useContext(TaskContext);

  // Define rewards by level
  const levelRewards = {
    1: [{ type: 'accessory', name: 'Basic Hat', unlocked: true }],
    2: [{ type: 'accessory', name: 'Cool Glasses', unlocked: character.level >= 2 }],
    3: [{ type: 'pet', name: 'Pixel Puppy', unlocked: character.level >= 3 }],
    5: [{ type: 'accessory', name: 'Wizard Wand', unlocked: character.level >= 5 }],
    7: [{ type: 'pet', name: 'Digital Cat', unlocked: character.level >= 7 }],
    10: [{ type: 'house', name: 'Starter House', unlocked: character.level >= 10 }]
  };

  return (
    <ScrollView style={styles.container}>
      {/* Rewards Overview */}
      <View style={styles.overviewContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{character.level}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completedTasks.length}</Text>
          <Text style={styles.statLabel}>Tasks Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{character.unlockedItems.length}</Text>
          <Text style={styles.statLabel}>Items Unlocked</Text>
        </View>
      </View>

      {/* Level-based rewards */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Rewards by Level</Text>
        
        {Object.entries(levelRewards).map(([level, rewards]) => (
          <View key={level} style={styles.rewardCard}>
            <View style={[
              styles.levelBadge, 
              parseInt(level) <= character.level ? styles.unlockedBadge : {}
            ]}>
              <Text style={styles.levelBadgeText}>Level {level}</Text>
            </View>
            
            <View style={styles.rewardsList}>
              {rewards.map((reward, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.rewardItem,
                    reward.unlocked ? styles.unlockedItem : styles.lockedItem
                  ]}
                >
                  <View style={styles.rewardIconContainer}>
                    <Text style={styles.rewardIcon}>
                      {reward.type === 'accessory' ? '🎩' : 
                       reward.type === 'pet' ? '🐶' : '🏠'}
                    </Text>
                  </View>
                  <View style={styles.rewardDetails}>
                    <Text style={styles.rewardName}>{reward.name}</Text>
                    <Text style={styles.rewardType}>
                      {reward.type.charAt(0).toUpperCase() + reward.type.slice(1)}
                    </Text>
                  </View>
                  {reward.unlocked ? (
                    <View style={styles.unlockedTag}>
                      <Text style={styles.unlockedTagText}>Unlocked</Text>
                    </View>
                  ) : (
                    <View style={styles.lockedTag}>
                      <Text style={styles.lockedTagText}>Locked</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Daily challenges section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Daily Challenges</Text>
        <View style={styles.challengeCard}>
          <Text style={styles.challengeTitle}>Complete 3 tasks in a row</Text>
          <Text style={styles.challengeReward}>Reward: 50 XP</Text>
          <TouchableOpacity style={styles.challengeButton}>
            <Text style={styles.challengeButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.challengeCard}>
          <Text style={styles.challengeTitle}>Add 5 new tasks</Text>
          <Text style={styles.challengeReward}>Reward: 30 XP</Text>
          <TouchableOpacity style={styles.challengeButton}>
            <Text style={styles.challengeButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  overviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '31%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9370DB',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  sectionContainer: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  rewardCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  levelBadge: {
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  unlockedBadge: {
    backgroundColor: '#9370DB',
  },
  levelBadgeText: {
    fontWeight: 'bold',
    color: '#333',
  },
  rewardsList: {
    padding: 16,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  unlockedItem: {
    opacity: 1,
  },
  lockedItem: {
    opacity: 0.6,
  },
  rewardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0e6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rewardIcon: {
    fontSize: 20,
  },
  rewardDetails: {
    flex: 1,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  rewardType: {
    fontSize: 14,
    color: '#666',
  },
  unlockedTag: {
    backgroundColor: '#9370DB',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  unlockedTagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  lockedTag: {
    backgroundColor: '#ddd',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  lockedTagText: {
    color: '#666',
    fontSize: 12,
    fontWeight: 'bold',
  },
  challengeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  challengeReward: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  challengeButton: {
    backgroundColor: '#9370DB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  challengeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default RewardsScreen;