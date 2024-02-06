# Section 2 TailwindCSS crash Course

Created: January 31, 2024 3:45 PM

# TailWind CSS

A utility first CSS framework packed with utility classes.

Utility-first CSS : writing tiny classes with one single purpose, and then combining them to build entire layouts.

It is thin layer of abstraction.

Install tailwind css for vite

`npm install -D prettier prettier-plugin-tailwindcss`  Auto set class name in which tailwinds css wants

## Working with tailwindcss

text-purple-300

my-10 : margin in y direction

text-xl : text extra large

![Untitled](Section%202%20TailwindCSS%20crash%20Course%20dbeeee479c6e481195f3680ad437a18b/Untitled.png)

**`sm:my-16`** applies a top and bottom margin of **`16`** units to an element on screens **equal to or larger than the small breakpoint** according to Tailwind CSS's responsive design utilities.

```jsx
<span className="sm:text-purple-500">
          Straight out of the oven, straight to you.
        </span>
```

if ≥640px color purple applied

if its gets smaller all the default css which you wrote without break point will be applied.

---

To apply similar classes of tailwind into multiple components we can use this which we can use like a normal css class of `input` .

```css
@layer components {
  .input {
    @apply w-full rounded-full border border-stone-200 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:outline-none focus:ring focus:ring-purple-400 md:px-6 md:py-3;
  }
}
```

But not to overuse this as we are killing the general purpose of the tailwindcss.

To access colors in layer components in you own create class you can use theme

- index.css
    
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    
    @layer components {
      .input {
        @apply w-full rounded-full border border-stone-200 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:outline-none focus:ring focus:ring-purple-400 md:px-6 md:py-3;
      }
      /* https://dev.to/afif/i-made-100-css-loaders-for-your-next-project-4eje */
      .loader {
        width: 45px;
        aspect-ratio: 0.75;
        --c: no-repeat linear-gradient(theme(colors.stone.800) 0 0);
        background:
          var(--c) 0% 50%,
          var(--c) 50% 50%,
          var(--c) 100% 50%;
        background-size: 20% 50%;
        animation: loading 1s infinite linear;
      }
    
      @keyframes loading {
        20% {
          background-position:
            0% 0%,
            50% 50%,
            100% 50%;
        }
        40% {
          background-position:
            0% 100%,
            50% 0%,
            100% 50%;
        }
        60% {
          background-position:
            0% 50%,
            50% 100%,
            100% 0%;
        }
        80% {
          background-position:
            0% 50%,
            50% 50%,
            100% 100%;
        }
      }
    }
    ```