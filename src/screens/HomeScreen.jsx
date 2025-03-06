import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Switch, Button, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthContext } from '../constants/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { setAlert, setWarning, isLoading, setIsLoading} = useAuthContext()
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      (async () => {
        try {
          const savedTasks = await AsyncStorage.getItem('tasks');
          if (savedTasks) {
            loadTasks(); // Load tasks from AsyncStorage on app start
          } else {
            fetchTasks();
          }
        } catch (error) {
          console.error('Error retrieving tasks:', error);
        }
      })()
    }, [])
  );

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      let response = await fetch('https://jsonplaceholder.typicode.com/todos');
      let data = await response.json();
      setTasks(data);
      saveTasks(data); // Save tasks locally
    } catch (err) {
      setError('Failed to fetch tasks.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save tasks locally using AsyncStorage
  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (err) {
      console.error('Error saving tasks', err);
    }
  };

  // Load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (err) {
      console.error('Error loading tasks', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter tasks based on selection
  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    return filter === 'Completed' ? task.completed : !task.completed;
  });

  if (error) return <Text>{error}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={{flex:1,alignItems:'center',backgroundColor: filter == 'All' ? '#F16821' : '#aaa',borderTopLeftRadius:10,borderBottomLeftRadius:10}} onPress={()=>setFilter('All')}>
          <Text style={{fontSize:16,paddingVertical:10,fontWeight:'600',color: filter == 'All' ? '#fff' : '#000'}}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flex:1,alignItems:'center',backgroundColor: filter == 'Completed' ? '#F16821' : '#aaa',}} onPress={()=>setFilter('Completed')}>
          <Text style={{fontSize:16,paddingVertical:10,fontWeight:'600',color: filter == 'Completed' ? '#fff' : '#000'}}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flex:1,alignItems:'center',backgroundColor: filter == 'Incomplete' ? '#F16821' : '#aaa',borderTopRightRadius:10,borderBottomRightRadius:10}} onPress={()=>setFilter('Incomplete')}>
          <Text style={{fontSize:16,paddingVertical:10,fontWeight:'600',color: filter == 'Incomplete' ? '#fff' : '#000'}}>Incomplete</Text>
        </TouchableOpacity>
      </View>
      {/* <TextInput 
        style={{padding:10,borderWidth:1,borderColor:'#F16821',marginBottom:10,borderRadius:10,backgroundColor:'#fff'}}
        placeholder="Search tasks..." 
        onChangeText={(text) => {
          console.log(text)
          const searchFilteredTasks = tasks.filter(task => task.title.toLowerCase().includes(text.toLowerCase()));
          setTasks([...searchFilteredTasks]);
        }} /> */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={{padding:10,borderBottomWidth:1,marginBottom:5,borderBottomColor:'#F16821',borderRadius:10,backgroundColor:'#fff'}} onPress={() => navigation.navigate('DetailScreen', { task: item })}>
            <Text style={{ fontWeight: 'bold' }}>
              Task Id: {item.id}
            </Text>
            <Text style={{ textDecorationLine: item.completed ? 'line-through' : 'none',fontSize:15,fontWeight:'400' }}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10,backgroundColor:"#F9F7F7" },
  filterContainer: { flexDirection: 'row', marginBottom: 10,gap:2 },
});

export default HomeScreen;
