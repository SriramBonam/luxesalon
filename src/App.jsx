import './App.css'
import { useState ,useRef} from "react";


function BookingForm() {
  const [customerName, setCustomerName] = useState("");
  const [service, setService] = useState("Hair Styling");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const prices = {
    "Hair Styling": 499,
    "Skin Care": 799,
    "Bridal Beauty": 4999,
  };

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5050/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName,
            service,
            appointmentDate: new Date(appointmentDate).toISOString(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save your booking.");
      }

      setMessage(
        `${data.message} Service: ${data.booking.service}. Price: ₹${data.booking.price}.`
      );

      setCustomerName("");
      setService("Hair Styling");
      setAppointmentDate("");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Could not connect to the server. Please check whether the backend is running."
          : err.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h2>Book Your Appointment</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          required
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
          placeholder="Enter your name"
        />

        {customerName ? (
          <p>Welcome to LuxeSalon, {customerName}!</p>
        ) : (
          <p>Please enter your name.</p>
        )}

        <label htmlFor="service">Choose a service:</label>

        <select
          id="service"
          value={service}
          onChange={(event) => setService(event.target.value)}
        >
          <option value="Hair Styling">Hair Styling — ₹499</option>
          <option value="Skin Care">Skin Care — ₹799</option>
          <option value="Bridal Beauty">Bridal Beauty — ₹4,999</option>
        </select>

        <p>Selected service: {service}</p>
        <p>Price: ₹{prices[service]}</p>

        <label htmlFor="appointmentDate">
          Choose appointment date and time:
        </label>

        <input
          id="appointmentDate"
          type="datetime-local"
          required
          min={new Date().toISOString().slice(0, 16)}
          value={appointmentDate}
          onChange={(event) => setAppointmentDate(event.target.value)}
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving Booking..." : "Book Now"}
        </button>
      </form>

      {message && (
        <p role="status">
          {message}
        </p>
      )}

      {error && (
        <p role="alert">
          {error}
        </p>
      )}
    </section>
  );
}


function App() {
  const [bookingStarted, setBookingStarted] = useState(false);
  const bookingRef = useRef(null);
  return (
    <div className="website">
      <header className="navbar">
        <h2 className="logo">Luxe<span>Salon</span></h2>

        <nav>
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <button
  className="nav-button"
  onClick={() => {
    setBookingStarted(true);
    bookingRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }}
>
  {bookingStarted ? "Appointment Started!" : "Book Appointment"}
</button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">YOUR BEAUTY, OUR PASSION</p>

            <h1>Feel Beautiful.<br />Look <span>Confident.</span></h1>

            <p className="hero-description">
              Discover your style at Luxe Salon. From stunning haircuts
              to relaxing beauty treatments, your perfect look starts here.
            </p>

            <a className="primary-button" href="#services">
              Explore Our Services →
            </a>

            <p className="hero-note">✦ Expert stylists · ✦ Personal care</p>
          </div>

          
<div className="hero-art">
  <img
    className="hero-photo"
    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=85"
    alt="Beautiful modern salon interior"
  />
</div>

        </section>

        <section className="services" id="services">
          <p className="eyebrow">A LITTLE SELF-CARE</p>
          <h2>Our Signature Services</h2>
          <p className="section-description">
            Thoughtfully tailored treatments to help you look and feel your best.
          </p>

          <div className="service-grid">
            <article className="service-card">
              <span className="service-icon">✂</span>
              <h3>Hair Styling</h3>
              <p>Fresh cuts and beautiful styles made just for you.</p>
              <p className="price">From ₹499</p>
            </article>

            <article className="service-card">
              <span className="service-icon">✧</span>
              <h3>Skin Care</h3>
              <p>Refresh and restore your natural glow.</p>
              <p className="price">From ₹799</p>
            </article>

            <article className="service-card">
              <span className="service-icon">❀</span>
              <h3>Bridal Beauty</h3>
              <p>Feel extraordinary for your most special moments.</p>
              <p className="price">From ₹4,999</p>
            </article>
          </div>
        </section>
         <div ref={bookingRef} id="booking">
  <BookingForm />
</div>
        <section className="contact" id="contact">
          <p className="eyebrow">YOUR MOMENT STARTS HERE</p>
          <h2>Ready for a little glow-up?</h2>
          <p>Get in touch with us to plan your next salon visit.</p>
          <a className="primary-button" href="mailto:hello@example.com">
            Contact Our Salon →
          </a>
        </section>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} Luxe Salon. Demo website for portfolio purposes.</p>
      </footer>
    </div>
  )
}

export default App