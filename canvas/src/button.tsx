// Get the canvas and context
const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

// Define Button class
class Button {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    color: string;
    textColor: string;

    constructor(x: number, y: number, width: number, height: number, text: string, color: string, textColor: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.color = color;
        this.textColor = textColor;
    }

    // Method to draw the button on the canvas
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = this.textColor;
        ctx.font = '20px Arial';
        ctx.fillText(this.text, this.x + (this.width / 4), this.y + (this.height / 1.6));
    }

    // Method to detect if the button is clicked
    isClicked(x: number, y: number): boolean {
        return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
    }
}

// Create a button instance
const myButton = new Button(50, 50, 200, 50, 'Click Me', '#007BFF', 'white');

// Draw the button
function drawCanvas(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    myButton.draw(ctx);
}

// Handle click events on the canvas
canvas.addEventListener('click', (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (myButton.isClicked(x, y)) {
        alert('Button Clicked!');
    }
});

// Initial drawing
drawCanvas();

  export default Button;