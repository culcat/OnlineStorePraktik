import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {api} from '../../utils/api.ts'
import { FormData } from "../../Types/types.ts";

const Auth: React.FC = () => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormData>();

    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Проверить, есть ли токен в локальном хранилище при загрузке компонента
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            navigate('/admin'); // Перенаправить на страницу /admin, если токен найден
        }
    }, [navigate]);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            const response = await axios.get(`${api}api/login`, {
                params: {
                    username: data.username,
                    password: data.password,
                },
            });

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);

                navigate('/');
            }
        } catch (error) {
            console.error('Authentication error', error);
            setError('Authentication failed');
        }
    };

    return (
        <div className="form">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3>Авторизация</h3>
                <div>
                    <Controller
                        name="username"
                        control={control}
                        rules={{ required: 'Username is required' }}
                        render={({ field }) => (
                            <TextField {...field} label="Логин" variant="outlined" fullWidth />
                        )}
                    />
                    {errors.username && <span>{errors.username.message}</span>}
                </div>
                <br />
                <div>
                    <Controller
                        name="password"
                        control={control}
                        rules={{ required: 'Password is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Пароль"
                                type="password"
                                variant="outlined"
                                fullWidth
                            />
                        )}
                    />
                    {errors.password && <span>{errors.password.message}</span>}
                </div>
                <br />
                <Button type="submit"  variant="contained" color="primary">
                    Войти        </Button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default Auth;