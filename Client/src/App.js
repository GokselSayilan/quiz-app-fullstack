import QuizApp from "./Components/QuizApp/QuizApp";
import { ThemeProvider } from "./Context/ThemeContext";
import { QuizProvider } from "./Context/QuizContext";
import { BrowserRouter as Router } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ScreenProvider } from "./Context/ScreenContext";

function App() {
  return (
    <Router>
      <ScreenProvider>
        <ThemeProvider>
          <QuizProvider>
            <QuizApp />
            <ToastContainer />
          </QuizProvider>
        </ThemeProvider>
      </ScreenProvider>
    </Router>
  );
}

export default App;
