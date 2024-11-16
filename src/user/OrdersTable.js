import {Button, Table} from 'react-bootstrap';

function OrdersTable({ orders, fetchOrderDetails }) {
    const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
    const translateStatus = (status) => {
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
    return (
        <div className="orders-section mt-4">
            {sortedOrders.length > 0 ? (<Table striped bordered hover>
                <thead>
                <tr>
                    <th>Дата замовлення</th>
                    <th>Статус</th>
                    <th>Загальна ціна</th>
                    <th>Дія</th>
                </tr>
                </thead>
                <tbody>
                {sortedOrders.map((order) => (
                    <tr key={order.id}>
                        <td>{new Date(order.date).toLocaleDateString()}</td>
                        <td>{translateStatus(order.status)}</td>
                        <td>{order.total_price} грн</td>
                        <td>
                            <Button
                                variant="info"
                                size="sm"
                                onClick={() => fetchOrderDetails(order.id)}
                            >
                                Деталі
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>

            </Table>) : <span>{"Немає варіантів"}</span>}
        </div>
    );
}

export default OrdersTable;
