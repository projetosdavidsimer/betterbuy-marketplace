#!/usr/bin/env node

/**
 * Script de Configuração de CLIs - OTIMIZADO
 * Instala e configura Vercel CLI e Supabase CLI
 * Versão 2.0 - Com login via Access Token para Supabase
 */

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const os = require('os');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, silent = false) {
  try {
    const output = execSync(command, { 
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit'
    });
    return output;
  } catch (error) {
    if (!silent) {
      log(`Erro: ${error.message}`, 'red');
    }
    return null;
  }
}

function checkInstalled(command, name) {
  const result = exec(`${command} --version`, true);
  if (result) {
    log(`✓ ${name} já instalado`, 'green');
    return true;
  }
  log(`✗ ${name} não instalado`, 'yellow');
  return false;
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

/**
 * NOVO: Configura Supabase Access Token diretamente
 * Método mais confiável que o login via browser
 */
async function configureSupabaseToken() {
  log('\n═══════════════════════════════════════════════════════════', 'cyan');
  log('  CONFIGURAÇÃO SUPABASE - MÉTODO ACCESS TOKEN', 'bright');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  
  log('\n📋 INSTRUÇÕES:', 'yellow');
  log('1. Acesse: https://app.supabase.com/account/tokens', 'cyan');
  log('2. Clique em "Generate new token"', 'cyan');
  log('3. Nome sugerido: "CLI Token - SIMER-IA"', 'cyan');
  log('4. Validade recomendada: 30 dias', 'cyan');
  log('5. Copie o token gerado', 'cyan');
  log('\n⚠️  IMPORTANTE: O token só será exibido UMA vez!', 'red');
  
  const hasToken = await question('\nVocê já tem um token? (s/n): ');
  
  if (hasToken.toLowerCase() !== 's') {
    log('\n📌 Gere o token primeiro e execute o script novamente.', 'yellow');
    return false;
  }
  
  await question('\nPressione ENTER quando tiver o token copiado...');
  
  const token = await question('\n🔑 Cole seu Access Token aqui: ');
  
  if (!token || token.trim().length === 0) {
    log('\n✗ Token vazio. Configuração cancelada.', 'red');
    return false;
  }
  
  log('\n🔄 Configurando autenticação...', 'cyan');
  
  try {
    // Método 1: Arquivo de configuração (mais confiável)
    const configDir = getSupabaseConfigDir();
    
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
      log(`✓ Diretório criado: ${configDir}`, 'green');
    }
    
    const tokenFile = path.join(configDir, 'access-token');
    fs.writeFileSync(tokenFile, token.trim(), 'utf-8');
    log(`✓ Token salvo em: ${tokenFile}`, 'green');
    
    // Método 2: Variável de ambiente (complementar)
    const envInstructions = getEnvInstructions(token.trim());
    
    // Testa a autenticação
    log('\n🔍 Testando autenticação...', 'cyan');
    const testResult = exec('supabase projects list', true);
    
    if (testResult) {
      log('\n✅ AUTENTICAÇÃO BEM-SUCEDIDA!', 'green');
      log('\n📁 Seus projetos Supabase:', 'bright');
      console.log(testResult);
      
      log('\n💡 DICA: Configure também a variável de ambiente para maior confiabilidade:', 'yellow');
      log(envInstructions, 'cyan');
      
      return true;
    } else {
      log('\n⚠️  Token salvo, mas não foi possível listar projetos.', 'yellow');
      log('Verifique se o token é válido.', 'yellow');
      log('\nTambém tente configurar a variável de ambiente:', 'yellow');
      log(envInstructions, 'cyan');
      
      return false;
    }
    
  } catch (error) {
    log(`\n✗ Erro ao configurar token: ${error.message}`, 'red');
    return false;
  }
}

/**
 * NOVO: Retorna o diretório de configuração do Supabase
 */
function getSupabaseConfigDir() {
  const platform = os.platform();
  const homeDir = os.homedir();
  
  if (platform === 'win32') {
    // Windows: %APPDATA%\supabase
    return path.join(homeDir, 'AppData', 'Roaming', 'supabase');
  } else {
    // Linux/Mac: ~/.config/supabase
    return path.join(homeDir, '.config', 'supabase');
  }
}

/**
 * NOVO: Retorna instruções para configurar variável de ambiente
 */
function getEnvInstructions(token) {
  const platform = os.platform();
  
  if (platform === 'win32') {
    return `
Windows PowerShell:
  [System.Environment]::SetEnvironmentVariable('SUPABASE_ACCESS_TOKEN', '${token}', 'User')

Windows CMD:
  setx SUPABASE_ACCESS_TOKEN "${token}"
`;
  } else {
    const shell = process.env.SHELL?.includes('zsh') ? 'zsh' : 'bash';
    const rcFile = shell === 'zsh' ? '~/.zshrc' : '~/.bashrc';
    
    return `
Linux/Mac:
  echo 'export SUPABASE_ACCESS_TOKEN="${token}"' >> ${rcFile}
  source ${rcFile}
`;
  }
}

/**
 * NOVO: Verifica status da autenticação do Supabase
 */
function checkSupabaseAuth() {
  log('\n🔍 Verificando autenticação Supabase...', 'cyan');
  
  const result = exec('supabase projects list', true);
  
  if (result && result.trim().length > 0) {
    log('✓ Autenticado com sucesso!', 'green');
    return true;
  } else {
    log('✗ Não autenticado', 'yellow');
    return false;
  }
}

/**
 * MELHORADO: Login Supabase com opções
 */
async function loginSupabase() {
  log('\n═══════════════════════════════════════════════════════════', 'cyan');
  log('  LOGIN SUPABASE', 'bright');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  
  // Verifica se já está autenticado
  if (checkSupabaseAuth()) {
    const change = await question('\nJá está autenticado. Deseja trocar de conta? (s/n): ');
    if (change.toLowerCase() !== 's') {
      return true;
    }
    exec('supabase logout', true);
  }
  
  log('\n📋 ESCOLHA O MÉTODO DE LOGIN:', 'yellow');
  log('1. Access Token (Recomendado - Mais confiável)', 'green');
  log('2. Browser (Método tradicional - Pode apresentar erros)', 'yellow');
  log('3. Pular', 'cyan');
  
  const method = await question('\nEscolha (1-3): ');
  
  switch (method.trim()) {
    case '1':
      return await configureSupabaseToken();
      
    case '2':
      log('\n🌐 Abrindo navegador para login...', 'cyan');
      log('⚠️  Se receber erro 404, use a opção 1 (Access Token)', 'yellow');
      exec('supabase login');
      return checkSupabaseAuth();
      
    case '3':
      log('\n⏭️  Login pulado', 'yellow');
      return false;
      
    default:
      log('\n✗ Opção inválida', 'red');
      return false;
  }
}

async function main() {
  log('\n╔═══════════════════════════════════════════════════════════╗', 'cyan');
  log('║         CONFIGURAÇÃO DE CLIs - SIMER-IA v2.0             ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════════╝\n', 'cyan');

  // Verificar Node.js
  log('Verificando Node.js...', 'bright');
  const nodeVersion = exec('node --version', true);
  if (nodeVersion) {
    log(`✓ Node.js ${nodeVersion.trim()}`, 'green');
  } else {
    log('✗ Node.js não encontrado', 'red');
    log('Instale Node.js: https://nodejs.org/', 'yellow');
    process.exit(1);
  }

  console.log('');

  // Verificar Git
  log('Verificando Git...', 'bright');
  const gitVersion = exec('git --version', true);
  if (gitVersion) {
    log(`✓ ${gitVersion.trim()}`, 'green');
  } else {
    log('✗ Git não encontrado', 'red');
    log('Instale Git: https://git-scm.com/', 'yellow');
    process.exit(1);
  }

  console.log('');

  // Verificar/Instalar Vercel CLI
  log('═══════════════════════════════════════════════════════════', 'cyan');
  log('VERCEL CLI', 'bright');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  
  const hasVercel = checkInstalled('vercel', 'Vercel CLI');
  
  if (!hasVercel) {
    const install = await question('\nDeseja instalar Vercel CLI? (s/n): ');
    if (install.toLowerCase() === 's') {
      log('\nInstalando Vercel CLI...', 'cyan');
      exec('npm install -g vercel');
      log('✓ Vercel CLI instalado', 'green');
    }
  }

  // Login Vercel
  if (checkInstalled('vercel', 'Vercel CLI')) {
    const login = await question('\nDeseja fazer login na Vercel? (s/n): ');
    if (login.toLowerCase() === 's') {
      log('\nAbrindo navegador para login...', 'cyan');
      exec('vercel login');
    }
  }

  console.log('');

  // Verificar/Instalar Supabase CLI
  log('═══════════════════════════════════════════════════════════', 'cyan');
  log('SUPABASE CLI', 'bright');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  
  const hasSupabase = checkInstalled('supabase', 'Supabase CLI');
  
  if (!hasSupabase) {
    const install = await question('\nDeseja instalar Supabase CLI? (s/n): ');
    if (install.toLowerCase() === 's') {
      log('\nInstalando Supabase CLI...', 'cyan');
      
      // Detecta SO e instala apropriadamente
      const platform = os.platform();
      if (platform === 'win32') {
        log('Windows detectado. Instalando via npm...', 'yellow');
        exec('npm install -g supabase');
      } else {
        log('Linux/Mac detectado. Usando script de instalação...', 'yellow');
        exec('bash scripts/install-supabase.sh');
      }
      
      // Verifica instalação
      if (checkInstalled('supabase', 'Supabase CLI')) {
        log('✓ Supabase CLI instalado com sucesso', 'green');
      } else {
        log('✗ Falha na instalação. Tente manualmente:', 'red');
        log('  npm install -g supabase', 'yellow');
      }
    }
  }

  // Login Supabase (MELHORADO)
  if (checkInstalled('supabase', 'Supabase CLI')) {
    const login = await question('\nDeseja configurar login no Supabase? (s/n): ');
    if (login.toLowerCase() === 's') {
      await loginSupabase();
    }
  }

  console.log('');

  // GitHub CLI (opcional)
  log('═══════════════════════════════════════════════════════════', 'cyan');
  log('GITHUB CLI (Opcional)', 'bright');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  
  const hasGH = checkInstalled('gh', 'GitHub CLI');
  
  if (!hasGH) {
    log('\nGitHub CLI não é obrigatório, mas facilita operações.', 'yellow');
    log('Para instalar: https://cli.github.com/', 'cyan');
  } else {
    const login = await question('\nDeseja fazer login no GitHub CLI? (s/n): ');
    if (login.toLowerCase() === 's') {
      exec('gh auth login');
    }
  }

  console.log('');

  // Resumo
  log('╔═══════════════════════════════════════════════════════════╗', 'green');
  log('║              CONFIGURAÇÃO CONCLUÍDA                       ║', 'green');
  log('╚═══════════════════════════════════════════════════════════╝\n', 'green');

  log('✅ Ferramentas configuradas:', 'bright');
  log('');
  
  if (checkInstalled('vercel', 'Vercel CLI')) {
    log('VERCEL CLI:', 'cyan');
    log('  vercel          - Deploy interativo', 'yellow');
    log('  vercel --prod   - Deploy para produção', 'yellow');
    log('  vercel env      - Gerenciar variáveis de ambiente', 'yellow');
    log('  vercel logs     - Ver logs da aplicação', 'yellow');
    log('');
  }

  if (checkInstalled('supabase', 'Supabase CLI')) {
    log('SUPABASE CLI:', 'cyan');
    log('  supabase init   - Inicializar projeto', 'yellow');
    log('  supabase start  - Iniciar Supabase local', 'yellow');
    log('  supabase db     - Gerenciar banco de dados', 'yellow');
    log('  supabase link   - Conectar ao projeto remoto', 'yellow');
    log('');
    
    // Verifica autenticação
    if (checkSupabaseAuth()) {
      log('  ✓ Autenticado no Supabase', 'green');
    } else {
      log('  ⚠️  Não autenticado. Execute novamente para configurar.', 'yellow');
    }
    log('');
  }

  log('📋 Próximos passos:', 'bright');
  log('1. Configure as variáveis de ambiente no .env', 'cyan');
  log('2. Execute: npm run deploy (para verificar build)', 'cyan');
  log('3. Execute: vercel --prod (para deploy)', 'cyan');
  log('');

  rl.close();
}

main().catch(error => {
  log('\n❌ Erro:', 'red');
  log(error.message, 'red');
  rl.close();
  process.exit(1);
});