import { useState } from 'react';
import { AuthContext } from './auth-context';

const USERS_KEY = 'drip-store-demo-users';
const SESSION_KEY = 'drip-store-demo-session';

const ITERATIONS = 150000;

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  if (password.length < 8) {
    return 'A senha deve ter pelo menos 8 caracteres.';
  }

  if (!/[A-Za-z]/.test(password)) {
    return 'A senha deve conter pelo menos uma letra.';
  }

  if (!/[0-9]/.test(password)) {
    return 'A senha deve conter pelo menos um número.';
  }

  return null;
}

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex) {
  if (
    typeof hex !== 'string' ||
    hex.length % 2 !== 0 ||
    !/^[0-9a-f]+$/i.test(hex)
  ) {
    throw new Error('Credencial inválida.');
  }

  return new Uint8Array(
    hex.match(/.{2}/g).map((part) => parseInt(part, 16))
  );
}

async function derivePassword(password, salt, iterations) {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256'
    },
    key,
    256
  );

  return bytesToHex(new Uint8Array(bits));
}

async function createCredential(password) {
  const salt = crypto.getRandomValues(
    new Uint8Array(16)
  );

  const hash = await derivePassword(
    password,
    salt,
    ITERATIONS
  );

  return {
    passwordSalt: bytesToHex(salt),
    passwordHash: hash,
    passwordIterations: ITERATIONS
  };
}

async function verifyPassword(password, user) {
  if (
    !user.passwordHash ||
    !user.passwordSalt ||
    !user.passwordIterations
  ) {
    return false;
  }

  const calculated = await derivePassword(
    password,
    hexToBytes(user.passwordSalt),
    user.passwordIterations
  );

  const expected = hexToBytes(user.passwordHash);
  const actual = hexToBytes(calculated);

  if (expected.length !== actual.length) {
    return false;
  }

  let difference = 0;

  for (let i = 0; i < expected.length; i++) {
    difference |= expected[i] ^ actual[i];
  }

  return difference === 0;
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = readStorage(USERS_KEY, []);
    return Array.isArray(saved) ? saved : [];
  });

  const [session, setSession] = useState(() =>
    readStorage(SESSION_KEY, null)
  );

  const sessionUser = session?.id
    ? users.find((user) => user.id === session.id)
    : null;

  // Contas antigas sem senha não mantêm acesso automático.
  const currentUser =
    sessionUser?.passwordHash ? sessionUser : null;

  async function register({
    name,
    email,
    password,
    confirmPassword
  }) {
    const cleanName = String(name || '').trim();
    const cleanEmail = normalizeEmail(email);

    if (cleanName.split(/\s+/).length < 2) {
      return {
        success: false,
        message: 'Informe seu nome completo.'
      };
    }

    if (!isValidEmail(cleanEmail)) {
      return {
        success: false,
        message: 'Informe um e-mail válido.'
      };
    }

    if (users.some((user) => user.email === cleanEmail)) {
      return {
        success: false,
        message: 'Este e-mail já está cadastrado.'
      };
    }

    const passwordError = validatePassword(
      String(password || '')
    );

    if (passwordError) {
      return {
        success: false,
        message: passwordError
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        message: 'As senhas não coincidem.'
      };
    }

    try {
      const credential = await createCredential(password);

      const newUser = {
        id: crypto.randomUUID(),
        name: cleanName,
        email: cleanEmail,
        createdAt: new Date().toISOString(),
        ...credential
      };

      const updatedUsers = [...users, newUser];
      const newSession = { id: newUser.id };

      localStorage.setItem(
        USERS_KEY,
        JSON.stringify(updatedUsers)
      );

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(newSession)
      );

      setUsers(updatedUsers);
      setSession(newSession);

      return { success: true };
    } catch {
      return {
        success: false,
        message: 'Não foi possível concluir o cadastro.'
      };
    }
  }

  async function login(email, password) {
    const cleanEmail = normalizeEmail(email);

    if (!isValidEmail(cleanEmail) || !password) {
      return {
        success: false,
        message: 'Informe e-mail e senha válidos.'
      };
    }

    const user = users.find(
      (item) => item.email === cleanEmail
    );

    if (!user) {
      return {
        success: false,
        message: 'E-mail ou senha inválidos.'
      };
    }

    if (!user.passwordHash) {
      return {
        success: false,
        requiresMigration: true,
        message:
          'Esta conta foi criada sem senha. Defina uma senha para continuar.'
      };
    }

    try {
      const valid = await verifyPassword(password, user);

      if (!valid) {
        return {
          success: false,
          message: 'E-mail ou senha inválidos.'
        };
      }

      const newSession = { id: user.id };

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(newSession)
      );

      setSession(newSession);

      return { success: true };
    } catch {
      return {
        success: false,
        message: 'Não foi possível validar o acesso.'
      };
    }
  }

  // Migração exclusivamente local de contas antigas.
  // Não verifica a propriedade do endereço de e-mail.
  async function migrateLegacyAccount({
    email,
    password,
    confirmPassword
  }) {
    const cleanEmail = normalizeEmail(email);

    const user = users.find(
      (item) => item.email === cleanEmail
    );

    if (!user || user.passwordHash) {
      return {
        success: false,
        message: 'Conta antiga não encontrada.'
      };
    }

    const passwordError = validatePassword(
      String(password || '')
    );

    if (passwordError) {
      return {
        success: false,
        message: passwordError
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        message: 'As senhas não coincidem.'
      };
    }

    try {
      const credential = await createCredential(password);

      const updatedUsers = users.map((item) =>
        item.id === user.id
          ? { ...item, ...credential }
          : item
      );

      const newSession = { id: user.id };

      localStorage.setItem(
        USERS_KEY,
        JSON.stringify(updatedUsers)
      );

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(newSession)
      );

      setUsers(updatedUsers);
      setSession(newSession);

      return { success: true };
    } catch {
      return {
        success: false,
        message: 'Não foi possível atualizar a conta.'
      };
    }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        register,
        login,
        logout,
        migrateLegacyAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
