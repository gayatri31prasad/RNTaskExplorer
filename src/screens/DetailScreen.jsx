import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailScreen = ({ route, navigation }) => {
  const { task = {} } = route?.params || {};
  const [completed, setCompleted] = useState(task?.completed);

  useEffect(() => {
    updateTaskStatus(task.id, completed);
  }, [completed]);

  // Update task completion status in AsyncStorage
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        let tasks = JSON.parse(storedTasks);
        const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, completed: newStatus } : t);
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      }
    } catch (err) {
      console.error('Error updating task status', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title,{fontSize:22,fontWeight:'700'}]}>Task Id: {task.id}</Text>
      <Text style={[styles.title,{marginTop:5}]}>{task.title}</Text>
      <Text style={{fontWeight:'500',marginTop:5,marginBottom:20, }}>Status:  <Text style={{color:completed ? 'green' : 'red'}}>{completed ? '✔ Completed' : '✖ Incomplete'}</Text></Text>
      <TouchableOpacity style={{ backgroundColor: !completed ? 'green' : 'red', padding: 10, borderRadius: 5, marginTop: 10,alignItems:'center' }} onPress={() => setCompleted(!completed)}>
        <Text style={{ color: '#fff',fontWeight:'500',fontSize:16 }}>{completed ? 'Mark Incomplete' : 'Mark Completed'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20,backgroundColor:"#F9F7F7" },
  title: { fontSize: 20, fontWeight: '500' }
});

export default DetailScreen;
