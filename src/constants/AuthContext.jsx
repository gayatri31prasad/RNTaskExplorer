import { ActivityIndicator, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { createContext, useContext } from 'react'

const AuthContext = createContext()

const AuthContextRapper = ({ children }) => {
    const [isLoading, setIsLoading] = React.useState(false)
    const [alertModal, setAlertModal] = React.useState({
        message: '',
        isVisible: false,
        isWarning: false,
    })

    const setAlert = (message) => {
        setAlertModal({
            message,
            isVisible: true,
            isWarning: false
        })
    }
    const setWarning = (message) => {
        setAlertModal({
            message,
            isVisible: true,
            isWarning: true
        })
    }
    const closeAlertModal = () => {
        setAlertModal({
            message: '',
            isVisible: false,
            isWarning: false
        })
    }

    return (
        <AuthContext.Provider value={{ setAlert, setWarning, isLoading, setIsLoading }}>
            {children}
            <Modal
                animationType="fade"
                visible={alertModal.isVisible}
                transparent={true}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff80' }} >
                    <View style={{ minWidth: '75%', minHeight: 200, padding: 20, backgroundColor: '#fff', alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#cccccc50', margin: 20 }}>
                        <Image source={alertModal.isWarning ? require('../Images/error.png') : require('../Images/success.png')} style={{ height: 120, width: 120 }} />
                        <Text style={{ fontSize: 16, color: '#000', fontWeight: 500, marginVertical: 10, marginBottom: 20, textAlign: 'center' }}>{alertModal.message}</Text>
                        <TouchableOpacity style={{ width: 140, alignItems: 'center', backgroundColor: '#F88379', borderRadius: 4 }} onPress={closeAlertModal}>
                            <Text style={{ fontSize: 18, color: '#fff', fontWeight: 500, padding: 5 }}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="fade"
                visible={isLoading}
                transparent={true} >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff90', zIndex: 99 }} >
                    <ActivityIndicator size={'large'} color={'#F88379'} />
                </View>
            </Modal>
        </AuthContext.Provider>)
}

const useAuthContext =()=> useContext(AuthContext)

export { useAuthContext, AuthContextRapper, AuthContext }