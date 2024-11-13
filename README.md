# PEVendo

A Next.js Project for material requesting, uniform ordering, and equipment borroinwg.

![](/public/Screenshot1.jpeg)
![](/public/Screenshot2.jpeg)

## Built with

This project is built with the following technologies:

- TailwindCSS
- DaisyUI
- Typescript
- ReactJS
- NextJS
- Supabase auth
- Supabase PostgreSQL
- Python
- Flask
- C++
- Arduino

## Dependencies

This project requires:

- NodeJS
- A Supabase Account

## Deployment

To deploy this project, create a [supabase instance](https://supabase.com/dashboard/projects).

Get the supabase API Keys and create a .env file containing these values.

```env
NEXT_PUBLIC_SUPABASE_URL= <insert URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY= <insert KEY>
```

Download the project folder and open it in VSCode. In the terminal run the following command (**IMPORTANT**: Make sure terminal is running within the project folder):

```bash
  pnpm i
```

After installing node packages, run the following command:
```bash
  npx prisma generate
```
```bash
  npx prisma studio //for database viewing
```
```bash
  pnpm dev
```
