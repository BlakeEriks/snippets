import { createCookieSessionStorage, redirect } from '@remix-run/node'
import { getUserById, User } from 'prisma-db'
import invariant from 'tiny-invariant'

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set')

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
})

const USER_SESSION_KEY = 'userId'

export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie')
  return sessionStorage.getSession(cookie)
}

export async function getUserId(request: Request): Promise<User['id'] | undefined> {
  const session = await getSession(request)
  const userId = session.get(USER_SESSION_KEY)
  return Number(userId)
}

export async function getUser(request: Request) {
  const userId = await getUserId(request)
  if (!userId) return null

  const user = await getUserById(userId)
  if (user) return user

  throw await logout(request)
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request)
  if (!userId) {
    // const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    throw redirect('/users')
  }
  return userId
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request)

  const user = await getUserById(userId)
  if (user) return user

  throw await logout(request)
}

export async function createUserSession({
  request,
  userId,
  remember,
  redirectTo,
}: {
  request: Request
  userId: string
  remember: boolean
  redirectTo: string
}) {
  return redirect(redirectTo, {
    headers: await createSessionHeaders(request, userId),
  })
}

export async function createSessionHeaders(request: Request, userId: string) {
  const session = await getSession(request)
  session.set(USER_SESSION_KEY, userId)
  return {
    'Set-Cookie': await sessionStorage.commitSession(session, {
      maxAge: 60 * 60 * 24 * 7,
    }),
  }
}

export async function logout(request: Request) {
  const session = await getSession(request)
  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  })
}
