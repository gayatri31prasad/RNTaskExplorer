import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { AuthContextRapper } from "./AuthContext.jsx"
import DetailScreen from "../screens/DetailScreen.jsx"
import HomeScreen from "../screens/HomeScreen.jsx"

const StackNavigation = createNativeStackNavigator()

const AppNavigation = () => {
  return (
    <NavigationContainer>
        <AuthContextRapper>
            <StackNavigation.Navigator screenOptions={{headerTitleAlign: "center"}} initialRouteName="HomeScreen">
                <StackNavigation.Screen name="HomeScreen" options={{title:"Task Explorer App"}} component={HomeScreen}/>
                <StackNavigation.Screen name="DetailScreen" options={{title:"Task Details"}} component={DetailScreen}/>
            </StackNavigation.Navigator>
        </AuthContextRapper>
    </NavigationContainer>
  )
}

export default AppNavigation