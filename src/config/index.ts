export default () => ({
    supabase: {
        key: process.env.SUPABASE_KEY,
        url: process.env.SUPABASE_URL,
    },
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
    }
})