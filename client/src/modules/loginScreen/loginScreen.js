import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import api from "../../services/api";
import CustomInput from "../../components/textInput/textInput";
import styles from "./style";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        webClientId: '551197539134-ibdnc4c97bgq8ifhlbo30fa5ab48fjtb.apps.googleusercontent.com',
        clientId: '551197539134-ibdnc4c97bgq8ifhlbo30fa5ab48fjtb.apps.googleusercontent.com',
    });

    useEffect(() => {
        if (response?.type === 'success') {
            
            const idToken = response.params?.id_token || response.authentication?.idToken;

            if (idToken) {
                handleGoogleLogin(idToken);
            } else {
                console.error("ID Token não encontrado na resposta do Google:", response);
            }
        }
    }, [response]);

    const handleGoogleLogin = async (idToken) => {
        setGoogleLoading(true); 
        try {
            const res = await api.post('/auth/google', { idToken });
            console.log('Login com Google realizado com sucesso:', res.data);
            // navigation.replace('Home');
        } catch (error) {
            console.error('Erro na resposta do backend (Google):', error.response?.data || error.message);
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleLogin = async () => {
        setEmailError('');
        setPasswordError('');

        if (!email) {
            setEmailError('Por favor, informe o seu e-mail.');
            return;
        }
        if (!password) {
            setPasswordError('Por favor, informe a sua senha.');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            console.log('Login com e-mail realizado com sucesso:', res.data);
        } catch (error) {
            console.error('Erro no Login:', error.response?.data || error.message);
            setEmailError(error.response?.data?.message || 'E-mail ou senha inválidos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Entrar na conta</Text>

            <CustomInput
                label='E-mail'
                value={email}
                onChangeText={setEmail} 
                placeholder='exemplo@dominio.com'
                keyboardType='email-address'
                autoCapitalize='none'
                error={emailError} 
            />

            <CustomInput
                label='Senha'
                value={password}
                onChangeText={setPassword} 
                placeholder='Ex: 12345678'
                secureTextEntry
                error={passwordError}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading || googleLoading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Entrar</Text>}
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.button, styles.googleButton]} 
                onPress={() => promptAsync()} 
                disabled={!request || loading || googleLoading}
            >
                {googleLoading ? (
                    <ActivityIndicator color="#000" />
                ) : (
                    <Text style={[styles.buttonText, styles.googleButtonText]}>Entrar com o Google</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkContainer}>
                <Text style={styles.linkText}>Não tem uma conta? <Text style={styles.linkBold}>Cadastre-se</Text></Text>
            </TouchableOpacity>
        </View>
    );
}