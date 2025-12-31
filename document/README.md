# LaTeX Report Template Example

This project serves as a template for creating professional reports using LaTeX. It is designed to be modular and easily customizable for different courses and purposes.

## Project Structure

The project is organized as follows:

-   **`IT3290_CALab.tex`**: The main entry point of the document. This is the file you compile.
-   **`includes/`**: Contains configuration and helper files.
    -   `teacher-info.tex`: Variables for instructor details (Name, Email, etc.).
    -   `course-info.tex`: Variables for course details (Course Code, Title, Semester).
    -   `document-header.tex`: Layout for the simplified title/header.
    -   `packages.tex`: List of LaTeX packages used in the project.
    -   `custom-commands.tex`: Custom macro definitions.
-   **`content/`**: Directory where the actual chapters/sections of your report reside (e.g., `Part1.tex`, `Part2.tex`).
-   **`images/`**: Store your graphical assets here.
-   **`Refs/`**: (Optional) Directory for bibliography or reference material.

## How to Use

Follow these steps to customize and create your own report:

### 1. Configure Personal & Course Information
Navigate to the `includes/` folder and edit the following files:
-   **`teacher-info.tex`**: Update the `\instructor`, `\email`, `\college`, etc., with the correct information.
-   **`course-info.tex`**: Update the `\coursetitle`, `\coursenumber`, `\semester`, etc.

### 2. Set the Report Title
Open the main file `IT3290_CALab.tex` and find the `\doctitle` command (around line 11):
```latex
\newcommand{\doctitle}{{{\Huge \textbf{YOUR REPORT TITLE HERE}}}}
```
Update the text inside to match your specific report topic.

### 3. Add Your Content
1.  Create new `.tex` files inside the `content/` folder for your sections (e.g., `Methodology.tex`, `Results.tex`).
2.  Write your content in these files.
3.  Go back to `IT3290_CALab.tex` and scroll to the end (before `\end{document}`).
4.  Include your new files using the `\input` command:
    ```latex
    \input{content/Methodology}
    \input{content/Results}
    ```

### 4. Images
Place your images in the `images/` directory. You can include them in your LaTeX files using standard commands:
```latex
\begin{figure}[h]
    \centering
    \includegraphics[width=0.8\textwidth]{images/your-image.png}
    \caption{Description of the image}
    \label{fig:my_image}
\end{figure}
```

### 5. Compile
Open `IT3290_CALab.tex` in your LaTeX editor (e.g., VS Code with LaTeX Workshop, Overleaf, or TeXShop) and build the project. The output will be a PDF file named `IT3290_CALab.pdf`.

**Recommended Tool:**
-   **VS Code** with the **LaTeX Workshop** extension is highly recommended for working with this template. It handles the build process automatically.

## Requirements
-   A LaTeX distribution (TeX Live, MiKTeX, or MacTeX).
-   Basic knowledge of LaTeX syntax.
