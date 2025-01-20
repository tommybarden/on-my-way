# On My Way - Eergency Response Acknowledgment App

This is a web-based application designed for firefighters and emergency responders to acknowledge their response to an
emergency. The app allows responders to indicate their availability and estimated arrival time, providing a real-time
overview for the team.

## Features

- Real-time acknowledgment of emergency response
- User authentication with Supabase
- Live updates using WebSockets technology
- Admin interface for managing users
- Server-Side Rendering (SSR) to ensure up-to-date data

## Getting Started

To use this app, you need:

- A Supabase account with a configured database
- (Optional) A Vercel account for easy deployment

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/tommybarden/on-my-way.git
   cd on-my-way
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Rename `.env.example` to `.env.local` and update it with your Supabase credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[YOUR_SUPABASE_URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_SUPABASE_ANON_KEY]
   NEXT_PUBLIC_STATION_COORDINATES=[YOUR_STATION_COORDINATES]
   NEXT_PUBLIC_OPENROUTESERVICE_KEY=[YOUR_OPENROUTESERVICE_KEY]
   SUPABASE_SERVICE_ROLE_KEY=[YOUR_SUPABASE_SERVICE_ROLE_KEY]
   DEFAULT_USER_PASSWORD=[YOUR_DEFAULT_USER_PASSWORD]
   ```

   You can find these values in your Supabase project settings under API.

4. **Run the development server**

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

## Deployment

For deployment, you can use Vercel:

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and create a new project.
3. Link your GitHub repository.
4. Add the required environment variables in the Vercel settings.
5. Deploy your application.

## License

This app is free to use but may not be commercialized.

## Feedback and Contributions

If you have suggestions or encounter issues, feel free to open an issue or contribute via pull requests.

