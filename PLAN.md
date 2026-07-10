# My Dashboard - Fastforward logistics

## Description
create a new vue project for me. use the create-vue scaffolding tool with Vite. Use Vite with typescript and vue router. Then add Vuetify 3 with Material Design Icons. Install chart.js and vue chart.js for data visualization. say no to pinia, testing, jsx, eslint, and prettifier. the commands in the terminal for me
Replace the starter content in this Vue project with a link-in-bio page. Here's what I want:

## Design requirments Requirements (Vuetify)
- Multi card layout, Max-with 1440px
- "Fastforward Logistics" as a heading, short description underneath
- Authenticated users have their profile available to click to make changes to their user account
- Summary cards in the hero area show a snapshot of the business and what I as the user should care about
- Users can drill down deeper into the data by clicking the cards or scrolling down the page
- Search and Filters are available to narrow down the data views
- Colorful charts that are WCAG 2.2 accessible show visual representations of the data 
- Dark mode by default with light/dark buttons
– Smooth hover animations on the link buttons
- Smooth animations to build the graphs as I scroll down the page
- Google Font: Montserrat
- Dominate color is orange to match the brand with accent colors of purple, blue, and magenta
- Use light color for light mode and dark colors for dark mode
- clean up and starter files or components I don't need

## Data
- Generate a fake dataset as a JSON file (src/data/metrics.json)
- 12 months of data (Jan-Dec) each month containing Revenue, Active shipments, on-time delivery, and Delayed loads

## Interaction
- Month picker filter above the data. It filters everything in the cards when a specific month is selected
- When ALL is selected, summary cars show annual totals/averages for all 12 months

## Tech
- Vue 3 + Typescript + Vuetify 3
- Chart.js via vue-chartjs for all charts
- Fake data from a local JSON file (No API calls)
- Single page - no routing needed for this app