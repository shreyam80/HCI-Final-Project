//Bringing in react functions by importing from React and ReactDOM
const { useState } = ReadableByteStreamController;
const { createRoot } = ReactDOM;

//Defining the main app component
const App = () => {
    //useState() is a function that returns two things, the current value
    //of the state and a function used to update the value of screen
    //the string "home" represents the initial screen the state should be set to
    const [screen, setScreen] = useState('home');

    //Example data
    const itineraries = ["Paris Trip", "NYC Adventure", "Tokyo Food Tour"];
    const places = ["Cafe Mocha", "Central Park", "Shibuya Crossing", "Louvre Museum"];

    const [reviews, setReviews] = useState([]);

    const [newReview, setNewReview] = useState("");

    //Rendering the different screens
    const renderScreen = () => {
        if (screen === 'home') {
            return (
                <div>
                    <h1>Travel App</h1>
                    <p>Welcome! Please choose an option below:</p>
                    <div className="buttons">
                        <button onClick={() => setScreen('itineraries')}>Browse Itineraries</button>
                        <button onClick={() => setScreen('review')}>Leave a Review</button>
                        <button onClick={() => setScreen('myItineraries')}>My Itineraries</button>
                        <button onClick={() => setScreen('browse')}>Browse Places</button>
                    </div>
                </div>
            );
        } 
        // Rendering the Browse Itineraries screen
        else if (screen === 'itineraries') {
            return (
                <div>
                    <h1>Browse Itineraries</h1>
                    <ul>
                        {itineraries.map((itinerary, index) => (
                            <li key={index}>{itinerary}</li>
                        ))}
                    </ul>
                    <button onClick={() => setScreen('home')}>Back to Home</button>
                </div>
            );
        }
        // Rendering the Leave a Review screen
        else if (screen === 'review') {
            return (
                <div>
                    <h1>Leave a Review</h1>
                    <input 
                        type="text" 
                        value={newReview} 
                        onChange={(e) => setNewReview(e.target.value)} 
                        placeholder="Write your review here..."
                    />
                    <button onClick={() => {
                        if (newReview) {
                            setReviews([...reviews, newReview]);
                            setNewReview("");
                        }
                    }}>Submit Review</button>
                    <h2>Submitted Reviews</h2>
                    <ul>
                        {reviews.map((review, index) => (
                            <li key={index}>{review}</li>
                        ))}
                    </ul>
                    <button onClick={() => setScreen('home')}>Back to Home</button>
                </div>
            );
        }
        // Rendering the My Itineraries screen
        else if (screen === 'myItineraries') {
            return (
                <div>
                    <h1>My Itineraries</h1>
                    <ul>
                        {itineraries.map((itinerary, index) => (
                            <li key={index}>{itinerary}</li>
                        ))}
                    </ul>
                    <button onClick={() => setScreen('home')}>Back to Home</button>
                </div>
            );
        }
        // Rendering the Browse Places screen
        else if (screen === 'browse') {
            return (
                <div>
                    <h1>Browse Places</h1>
                    <ul>
                        {places.map((place, index) => (
                            <li key={index}>{place}</li>
                        ))}
                    </ul>
                    <button onClick={() => setScreen('home')}>Back to Home</button>
                </div>
            );
        }
    };

    //everything above is like a function, it exists only inside this component
    //Now, that stuff is returned where renderScreen() is called below. Based on the screen we are in when
    //renderScreen is called, that javascript code all gets returned to the slot

    //This is all stuff that will always show, so that's why it is separate from
    //the above conditionals
    return (
        <div>
            {renderScreen()}
            <div className="navbar">
                <button onClick={() => setScreen('itineraries')}>Itineraries</button>
                <button onClick={() => setScreen('review')}>Review</button>
                <button onClick={() => setScreen('myItineraries')}>My Itineraries</button>
                <button onClick={() => setScreen('browse')}>Browse</button>
            </div>
        </div>
    );
};

// Rendering the App component to the DOM
//createRoot initializes a react application and connects it to HTML file
const root = createRoot(document.getElementById('root'));
root.render(<App />);