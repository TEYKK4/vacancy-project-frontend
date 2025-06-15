import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home/Home.tsx";
import FindJobseeker from "./pages/FindJobseeker/FindJobseeker.tsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/find-jobseeker" element={<FindJobseeker/>} />
            </Routes>
        </Router>
    );
};

export default App;
