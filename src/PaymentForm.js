import { useState } from 'react';
import './App.css'; // keep merged CSS

function PaymentForm() {
    const [data, setData] = useState({
        amount: '',
        productinfo: '',
        firstname: '',
        email: '',
        phone: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setData({
            ...data,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!data.amount || !data.firstname || !data.email) {
            setError('Please fill required fields');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:3001/payment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-webhook-signature': 'topSecret'
                },
                body: JSON.stringify(data)
            });

            const payuData = await response.json();

            if (!payuData.payuUrl) {
                setError('Payment gateway error');
                setLoading(false);
                return;
            }

            const form = document.createElement('form');
            form.method = 'POST';
            form.action = payuData.payuUrl;

            for (let key in payuData) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = payuData[key];
                form.appendChild(input);
            }

            document.body.appendChild(form);
            form.submit();
        } catch (err) {
            console.log('error', err);
            setError(err[0]);
            setLoading(err);
        }
    };

    return (
        <div className="page">
            <div className="card">
                <h2 className="title">Secure Payment</h2>

                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label>Amount</label>
                        <input name="amount" onChange={handleChange} placeholder="₹100" />
                    </div>

                    <div className="field">
                        <label>Product Info</label>
                        <input name="productinfo" onChange={handleChange} placeholder="Product name" />
                    </div>

                    <div className="field">
                        <label>First Name</label>
                        <input name="firstname" onChange={handleChange} placeholder="Your name" />
                    </div>

                    <div className="field">
                        <label>Email</label>
                        <input name="email" onChange={handleChange} placeholder="you@email.com" />
                    </div>

                    <div className="field">
                        <label>Phone</label>
                        <input name="phone" onChange={handleChange} placeholder="9999999999" />
                    </div>

                    {error && <p className="error">{error}</p>}

                    <button className="pay-btn" disabled={loading}>
                        {loading ? 'Processing...' : 'Pay Now'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PaymentForm;
