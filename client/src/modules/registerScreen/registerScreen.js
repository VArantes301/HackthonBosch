import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../../services/api';
import CustomInput from '../../components/textInput/textInput';
import styles from './style';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setNameError('');
        setEmailError('');
        setPasswordError('');

        if (!name) {
            setNameError('Please, provide your name');
            return;
        }

        if (!email) {
            setEmailError('Please, provide your email');
            return;
        }

        if (!password) {
            setPasswordError('Please, provide your password');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/auth/register', { name, email, password });
            console.log('Registro bem-sucedido:', res.data);
            navigation.navigate('Login');
        } catch (error) {
            console.error('Erro no registro:', error.response?.data || error.message);
            setEmailError(error.response?.data?.message || 'Erro ao realizar cadastro.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Criar Conta</Text>

            <CustomInput
                label="Nome completo"
                value={name}
                onChangeText={setName}
                placeholder="Seu nome"
                error={nameError}
            />

            <CustomInput
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                placeholder="exemplo@dominio.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={emailError}
            />

            <CustomInput
                label="Senha"
                value={password}
                onChangeText={setPassword}
                placeholder="Crie uma senha"
                secureTextEntry
                error={passwordError}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
                <Text style={styles.linkText}>
                    Já possui uma conta? <Text style={styles.linkBold}>Faça Login</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}