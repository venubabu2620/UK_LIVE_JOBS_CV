"use client";
import { signIn,signOut } from "next-auth/react";
export function LoginButton(){return <button className="btn soft" onClick={()=>signIn()}>Log in</button>}
export function LogoutButton(){return <button className="btn soft" onClick={()=>signOut({callbackUrl:"/"})}>Log out</button>}
