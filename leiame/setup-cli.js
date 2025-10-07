#!/usr/bin/env node

/**
 * Script de Configuração de CLIs
 * Instala e configura Vercel CLI e Supabase CLI
 */

const { execSync } = require('child_process');
const readline = require('readline');

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
  cyan: '\x1b[36m'
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

async function main() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║         CONFIGURAÇÃO DE CLIs - SIMER-IA                    ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

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
  log('═══════════════════════���═══════════════════════════════════', 'cyan');
  log('SUPABASE CLI', 'bright');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  
  const hasSupabase = checkInstalled('supabase', 'Supabase CLI');
  
  if (!hasSupabase) {
    const install = await question('\nDeseja instalar Supabase CLI? (s/n): ');
    if (install.toLowerCase() === 's') {
      log('\nExecutando script de instalacao...', 'cyan');
      exec('bash scripts/install-supabase.sh');
    }
  }

  // Login Supabase
  if (checkInstalled('supabase', 'Supabase CLI')) {
    const login = await question('\nDeseja fazer login no Supabase? (s/n): ');
    if (login.toLowerCase() === 's') {
      log('\nPara fazer login, você precisa de um Access Token:', 'yellow');
      log('1. Acesse: https://app.supabase.com/account/tokens', 'cyan');
      log('2. Gere um novo token', 'cyan');
      log('3. Execute: supabase login', 'cyan');
      log('4. Cole o token quando solicitado', 'cyan');
      
      const proceed = await question('\nProsseguir com login? (s/n): ');
      if (proceed.toLowerCase() === 's') {
        exec('supabase login');
      }
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
  log('╔════════════════════════════════════════════════════════════╗', 'green');
  log('║              CONFIGURAÇÃO CONCLUÍDA                        ║', 'green');
  log('╚════════════════════════════════════════════════════════════╝\n', 'green');

  log('Ferramentas disponíveis:', 'bright');
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
  }

  log('Próximos passos:', 'bright');
  log('1. Configure as variáveis de ambiente no .env', 'cyan');
  log('2. Execute: npm run deploy (para verificar build)', 'cyan');
  log('3. Execute: vercel --prod (para deploy)', 'cyan');
  log('');

  rl.close();
}

main().catch(error => {
  log('\nErro:', 'red');
  log(error.message, 'red');
  rl.close();
  process.exit(1);
});
