import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt"

const handler = NextAuth({
    providers: [
      CredentialsProvider({
        name:'Credentials',
        credentials:{
           email:{label: "Email",type:"text"},
           password:{label:"Password",type:"password"} 
        },

        // once authorize
        async authorize(credentials) {
            if(!credentials?.email || !credentials?.password){
                throw new Error("Email and password required")
            }

            // find the user
            const user = await prisma.user.findUnique({
                where:{email:credentials.email}
            })

            if(!user) {
              throw new Error("User not found")
            }

            // verify password
            const passwordValid = await bcrypt.compare(
                credentials.password,
                user.password
            )

            if(!passwordValid) {
                throw new Error("Password invalid");
            }

            return {
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role,
            };
        },
      }) , 
    ],

    callbacks: {
        async jwt({token,user}){
            if(user){
                token.id = user.id;
                token.role = user.role;
            }

            return token;
        },

        async session({session,token}){
            session.user.id = token.id;
            session.user.role = token.role;
            return session;
        },
    },

    pages: {
        signIn :"/login",
    },

    secret: process.env.NEXTAUTH_SECRET,
});



export { handler as GET , handler as POST }