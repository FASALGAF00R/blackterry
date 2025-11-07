import { useState } from 'react';

function App() {
  const [loading, setLoading] = useState(false);

  // Function to load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Function to handle payment
  const handlePayment = async () => {
    setLoading(true);

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      // Call your backend to create Razorpay order
      const orderResponse = await fetch("http://localhost:3000/api/checkout/createorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "6902e2fe4a97d83ba072425c" })
      });

      const data = await orderResponse.json();
      console.log(data,".............");
      
      if (!data?.razorpayOrderId) {
        alert("Server error. Cannot create order.");
        setLoading(false);
        return;
      }

      // Razorpay options
      const options = {
        key: "rzp_test_Rc23zKSi6P5WfQ",
        amount: data.amount,
        currency: data.currency,
        name: "Your Company Name",
        description: "Test Transaction",
        order_id: data.id,
        handler: function (response) {
          console.log("Payment Success:", response);
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      setLoading(false);

    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Razorpay Payment Page</h2>
      <button
        onClick={handlePayment}
        style={{
          padding: "1rem 2rem",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#3399cc",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}

export default App;
