// Create sparkling background
function createSparkles() {
    const sparklesContainer = document.getElementById('sparkles');
    const colors = ['#ff69b4', '#00bfff', '#ff1493', '#00ffff', '#9400d3', '#00ff7f'];
    const sparkleCount = 100;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        sparkle.style.left = `${Math.random() * 100}vw`;
        sparkle.style.top = `${Math.random() * 100}vh`;
        sparkle.style.width = `${Math.random() * 6 + 2}px`;
        sparkle.style.height = sparkle.style.width;
        sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        sparkle.style.animationDuration = `${Math.random() * 10 + 5}s`;
        sparkle.style.animationDelay = `${Math.random() * 5}s`;
        sparklesContainer.appendChild(sparkle);
    }
}

// Calculator History
class CalculatorHistory {
    constructor() {
        this.history = [];
        this.historyList = document.getElementById('historyList');
        this.currentHistory = document.getElementById('currentHistory');
        this.historyStory = document.getElementById('historyStory');
        this.historyToggle = document.getElementById('historyToggle');
        
        this.historyToggle.addEventListener('click', () => {
            this.historyStory.style.display = this.historyStory.style.display === 'block' ? 'none' : 'block';
            this.historyToggle.textContent = this.historyStory.style.display === 'block' ? 'Hide History' : 'Show History';
        });
    }
    
    addEntry(operation, result) {
        const timestamp = new Date().toLocaleTimeString();
        const entry = {
            operation,
            result,
            timestamp
        };
        this.history.unshift(entry); // Add to beginning of array
        
        // Keep only last 20 entries
        if (this.history.length > 20) {
            this.history.pop();
        }
        
        this.updateDisplay();
    }
    
    updateDisplay() {
        this.historyList.innerHTML = '';
        this.history.forEach(entry => {
            const li = document.createElement('li');
            li.innerHTML = `<span style="color:#ff69b4">[${entry.timestamp}]</span> ${entry.operation} = <span style="color:#0ff">${entry.result}</span>`;
            this.historyList.appendChild(li);
        });
    }
    
    updateCurrentHistory(operation) {
        this.currentHistory.textContent = operation;
    }
    
    clear() {
        this.history = [];
        this.updateDisplay();
        this.currentHistory.textContent = '';
    }
}

// Calculator Logic
document.addEventListener('DOMContentLoaded', function() {
    // Start background animations
    createSparkles();
    
    // Initialize history
    const calculatorHistory = new CalculatorHistory();
    
    // Calculator functionality
    const display = document.getElementById('currentInput');
    const buttons = document.querySelectorAll('.btn');
    
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let resetScreen = false;
    let calculationHistory = '';

    function updateDisplay() {
        display.textContent = currentInput;
        
        // Add color-changing effect based on input
        if (operation) {
            display.style.color = `hsl(${Math.random() * 60 + 300}, 100%, 70%)`; // Pink/purple range
        } else {
            display.style.color = '#ff69b4'; // Default pink
        }
    }

    function appendNumber(number) {
        if (currentInput === '0' || resetScreen) {
            currentInput = number;
            resetScreen = false;
        } else {
            currentInput += number;
        }
    }

    function addDecimal() {
        if (resetScreen) {
            currentInput = '0.';
            resetScreen = false;
            return;
        }
        if (currentInput.includes('.')) return;
        currentInput += '.';
    }

    function handleOperator(op) {
        if (op === 'AC') {
            currentInput = '0';
            previousInput = '';
            operation = null;
            calculationHistory = '';
            calculatorHistory.updateCurrentHistory('');
            
            // Add visual feedback
            document.querySelector('.calculator-container').style.boxShadow = 
                '0 0 30px rgba(255, 105, 180, 0.8), 0 0 20px rgba(0, 191, 255, 0.8)';
            setTimeout(() => {
                document.querySelector('.calculator-container').style.boxShadow = 
                    '0 0 30px rgba(0, 191, 255, 0.3), 0 0 20px rgba(255, 105, 180, 0.3)';
            }, 300);
            
            calculatorHistory.clear();
            return;
        }

        if (op === '±') {
            currentInput = (parseFloat(currentInput) * -1).toString();
            return;
        }

        if (op === '%') {
            currentInput = (parseFloat(currentInput) / 100).toString();
            return;
        }

        if (op === '=') {
            if (!operation) return;
            
            // Save the full calculation before computing
            const fullOperation = `${previousInput} ${operation} ${currentInput}`;
            
            compute();
            
            // Add to history after computation
            calculatorHistory.addEntry(fullOperation, currentInput);
            
            operation = null;
            previousInput = '';
            resetScreen = true;
            calculationHistory = '';
            
            // Add visual feedback for equals
            const equalsBtn = document.querySelector('.equals');
            equalsBtn.style.boxShadow = '0 0 30px rgba(255, 105, 180, 0.8), 0 0 30px rgba(0, 191, 255, 0.8)';
            setTimeout(() => {
                equalsBtn.style.boxShadow = '0 0 15px rgba(255, 105, 180, 0.5), 0 0 15px rgba(0, 191, 255, 0.5)';
            }, 300);
            return;
        }

        if (operation !== null) {
            // If we're chaining operations, compute the current one first
            compute();
        }
        
        // Update the calculation history display
        calculationHistory = `${currentInput} ${op}`;
        calculatorHistory.updateCurrentHistory(calculationHistory);
        
        previousInput = currentInput;
        operation = op;
        resetScreen = true;
        
        // Add visual feedback for operator
        const activeBtn = document.querySelector(`[data-value="${op}"]`);
        activeBtn.style.boxShadow = '0 0 20px rgba(255, 105, 180, 0.8), inset 0 0 10px rgba(0, 191, 255, 0.8)';
        setTimeout(() => {
            activeBtn.style.boxShadow = '0 0 10px rgba(0, 191, 255, 0.2), inset 0 0 5px rgba(255, 105, 180, 0.2)';
        }, 300);
    }

    function compute() {
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) return;

        switch (operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = prev / current;
                break;
            default:
                return;
        }

        // Round to 10 decimal places to avoid floating point errors
        currentInput = parseFloat(result.toFixed(10)).toString();
        operation = null;
    }

    // Button click handler
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${event.clientX - rect.left - size/2}px`;
            ripple.style.top = `${event.clientY - rect.top - size/2}px`;
            button.appendChild(ripple);
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            if (!isNaN(value) || value === '.') {
                if (value === '.') {
                    addDecimal();
                } else {
                    appendNumber(value);
                }
            } else {
                handleOperator(value);
            }
            
            updateDisplay();
        });
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9') {
            appendNumber(e.key);
        } else if (e.key === '.') {
            addDecimal();
        } else if (e.key === 'Enter' || e.key === '=') {
            handleOperator('=');
        } else if (e.key === 'Escape') {
            handleOperator('AC');
        } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            handleOperator(e.key);
        } else if (e.key === '%') {
            handleOperator('%');
        }
        
        updateDisplay();
    });

    // Initial display update
    updateDisplay();
});