// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import {
  sendWhatsappVerification,
  sendVerificationEmail,
  generateVerificationCode,
} from '@/app/lib/verification'

const prisma = new PrismaClient()

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing email or password')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          throw new Error('Invalid email or password')
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) {
          throw new Error('Invalid email or password')
        }

        if (!user.emailVerified && !user.whatsappVerified) {
          const code = generateVerificationCode()

          await prisma.verificationCode.upsert({
            where: { userId: user.id },
            update: {
              code,
              expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            },
            create: {
              userId: user.id,
              code,
              expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            },
          })

          if (user.phone) {
            await sendWhatsappVerification(user.phone, code)
          } else {
            await sendVerificationEmail(user.email, code)
          }

          const error = encodeURIComponent('verify_required_' + encodeURIComponent(user.email))
          throw new Error(error)
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }