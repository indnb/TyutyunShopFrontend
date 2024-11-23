export const translateStatus = (status) => {
    switch (status) {
        case 'pending':
            return 'В очікуванні';
        case 'processing':
            return 'В обробці';
        case 'completed':
            return 'Завершено';
        default:
            return 'Невідомий статус';
    }
};
