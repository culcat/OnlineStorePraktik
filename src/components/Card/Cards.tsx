import React, { useState, useEffect } from 'react';
import { Box, Card, CardActions, CardContent, Grid, Typography, Button, TextField } from '@mui/material';
import axios from 'axios';
import { api } from "../../utils/api.ts";
import { product } from '../../Types/types.ts';
import Review from "../../Types/types.ts";
import Sidebar from "../SideBar/Sidebar.tsx";

interface ProductCardProps {
    product: product;
    onBuyClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuyClick }) => {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');

    const handleBuyClick = () => {
        // Вызываем функцию onBuyClick переданную из компонента Cards
        onBuyClick();
    };

    const handleReviewSubmit = () => {
        // Здесь можно отправить POST-запрос для отправки отзыва на сервер
        const reviewData: { user_id: number; product_id: number; rating: number; comment: string } = {
            user_id: 1, // Замените на фактическое имя пользователя
            product_id: product.id,
            rating,
            comment,

        };

        axios.post(`${api}api/reviews`, reviewData)
            .then(response => {
                // Обработка успешного ответа от сервера
                console.log('Review submitted successfully:', response.data);
                // Очистка полей формы
                setRating(0);
                setComment('');
            })
            .catch(error => {
                // Обработка ошибки
                console.error('Error submitting review:', error);
            });
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    {product.product_name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                    Категория: {product.category_name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                    Цена: ${product.price.toFixed(2)}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                    Осталось: {product.quantity}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary" onClick={handleBuyClick}>
                    Купить
                </Button>
            </CardActions>
            <CardContent>
                <Typography variant="h6">Оставить отзыв:</Typography>
                <TextField
                    label="Оценка"
                    type="number"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                />
                <TextField
                    label="Комментарий"
                    multiline
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleReviewSubmit}>
                    Отправить отзыв
                </Button>
            </CardContent>
        </Card>
    );
};

export const Cards: React.FC = () => {
    const [products, setProducts] = useState<product[]>([]);
    const [reviews, setReviews] = useState<Review[][]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get(`${api}api/products`, { httpsAgent: { rejectUnauthorized: false } })
            .then(response => {
                setProducts(response.data.productsWithCategories);
                setLoadingProducts(false);

                const productIds = response.data.productsWithCategories.map((product: product) => product.id);
                loadReviewsForProducts(productIds);
            })
            .catch(error => {
                console.error('Error fetching product data:', error);
                setLoadingProducts(false);
            });
    }, []);

    const loadReviewsForProducts = async (productIds: number[]) => {
        const reviewsPromises = productIds.map(productId => axios.get(`${api}api/reviews?id=${productId}`));
        try {
            const reviewsResponses = await Promise.all(reviewsPromises);
            const reviewsData: Review[][] = reviewsResponses.map(response => response.data.productsWithCategories);
            setReviews(reviewsData);
            setLoadingReviews(false);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setLoadingReviews(false);
        }
    };

    const handleBuyClick = () => {
        // Обработка нажатия кнопки "Купить"
        console.log('Buy button clicked!');
    };

    useEffect(() => {
        if (!token) {
            window.location.href = '/admin/auth';
        }
    }, []);

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />

            <Grid container spacing={3} >
                {(loadingProducts || loadingReviews) ? (
                    <Typography>Loading...</Typography>
                ) : (
                    products.map((product, index) => (
                        <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}> <br/>
                            <br/>
                            <br/>
                            <br/>
                            <ProductCard product={product} onBuyClick={handleBuyClick} />
                            <div>
                                <Typography variant="h5">Отзывы:</Typography>
                                {reviews[index]?.map((review: Review) => (
                                    <div key={review.id}>
                                        <Typography>Оценка: {review.rating}</Typography>
                                        <Typography>Комментарий: {review.comment}</Typography>
                                        <Typography>Имя пользователя: {review.username}</Typography>
                                    </div>
                                ))}
                            </div>
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    );
};
