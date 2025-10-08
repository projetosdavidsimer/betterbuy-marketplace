#!/usr/bin/env python3
"""
Script de Auditoria do Projeto BetterBuy
Analisa o código para encontrar problemas comuns que causam:
- Loop infinito
- Erros de hidratação
- Re-renders desnecessários
"""

import os
import re
from pathlib import Path
from typing import List, Dict, Tuple

class ProjectAuditor:
    def __init__(self, project_path: str):
        self.project_path = Path(project_path)
        self.issues = []
        
    def audit(self):
        """Executa auditoria completa"""
        print("🔍 Iniciando auditoria do projeto BetterBuy...\n")
        
        # Auditar componentes React
        self.audit_react_components()
        
        # Auditar hooks
        self.audit_hooks()
        
        # Auditar problemas de hidratação
        self.audit_hydration_issues()
        
        # Gerar relatório
        self.generate_report()
        
    def find_files(self, pattern: str) -> List[Path]:
        """Encontra arquivos por padrão"""
        files = []
        for ext in ['.tsx', '.ts', '.jsx', '.js']:
            files.extend(self.project_path.rglob(f'*{ext}'))
        return [f for f in files if 'node_modules' not in str(f) and '.next' not in str(f)]
    
    def audit_react_components(self):
        """Audita componentes React"""
        print("📦 Auditando componentes React...")
        
        files = self.find_files('*.tsx')
        
        for file in files:
            try:
                content = file.read_text(encoding='utf-8')
                
                # Verificar arrays/objetos inline em props
                self.check_inline_objects(file, content)
                
                # Verificar .map() sem useMemo
                self.check_unmemoized_maps(file, content)
                
                # Verificar funções inline em props
                self.check_inline_functions(file, content)
                
                # Verificar useState com objetos/arrays
                self.check_state_initialization(file, content)
                
            except Exception as e:
                print(f"⚠️  Erro ao ler {file}: {e}")
    
    def audit_hooks(self):
        """Audita hooks customizados"""
        print("\n🪝 Auditando hooks customizados...")
        
        hooks_path = self.project_path / 'my-app' / 'hooks'
        if not hooks_path.exists():
            return
            
        for file in hooks_path.glob('*.ts'):
            try:
                content = file.read_text(encoding='utf-8')
                
                # Verificar dependências de useEffect/useMemo/useCallback
                self.check_hook_dependencies(file, content)
                
                # Verificar se retorna funções estáveis
                self.check_unstable_returns(file, content)
                
            except Exception as e:
                print(f"⚠️  Erro ao ler {file}: {e}")
    
    def audit_hydration_issues(self):
        """Audita problemas de hidratação"""
        print("\n💧 Auditando problemas de hidratação...")
        
        files = self.find_files('*.tsx')
        
        for file in files:
            try:
                content = file.read_text(encoding='utf-8')
                
                # Verificar uso de window/document sem verificação
                self.check_browser_apis(file, content)
                
                # Verificar Date.now() ou Math.random()
                self.check_dynamic_values(file, content)
                
                # Verificar cookies/localStorage sem useEffect
                self.check_storage_access(file, content)
                
            except Exception as e:
                print(f"⚠️  Erro ao ler {file}: {e}")
    
    def check_inline_objects(self, file: Path, content: str):
        """Verifica objetos/arrays criados inline em props"""
        # Padrão: prop={{...}} ou prop={[...]}
        patterns = [
            (r'(\w+)=\{\{[^}]+\}\}', 'Objeto inline em prop'),
            (r'(\w+)=\{\[[^\]]+\]\}', 'Array inline em prop'),
        ]
        
        for pattern, msg in patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                line_num = content[:match.start()].count('\n') + 1
                self.add_issue(file, line_num, 'PERFORMANCE', msg, match.group(0))
    
    def check_unmemoized_maps(self, file: Path, content: str):
        """Verifica .map() sem useMemo"""
        # Procurar por .map() fora de useMemo
        lines = content.split('\n')
        in_usememo = False
        usememo_depth = 0
        
        for i, line in enumerate(lines, 1):
            # Detectar início de useMemo
            if 'useMemo' in line:
                in_usememo = True
                usememo_depth = line.count('(') - line.count(')')
            elif in_usememo:
                usememo_depth += line.count('(') - line.count(')')
                if usememo_depth <= 0:
                    in_usememo = False
            
            # Verificar .map() fora de useMemo
            if '.map(' in line and not in_usememo and 'const' in line:
                # Ignorar se for dentro de JSX (return)
                if 'return' not in lines[max(0, i-5):i]:
                    self.add_issue(file, i, 'LOOP_RISK', 
                                 'Array.map() sem useMemo pode causar loop infinito', 
                                 line.strip())
    
    def check_inline_functions(self, file: Path, content: str):
        """Verifica funções inline em props"""
        # Padrão: onChange={() => ...} ou onClick={() => ...}
        pattern = r'(onChange|onClick|onSubmit|on\w+)=\{(?:\([^)]*\)|[^}])*=>'
        
        matches = re.finditer(pattern, content)
        for match in matches:
            line_num = content[:match.start()].count('\n') + 1
            # Verificar se não está dentro de useCallback
            context = content[max(0, match.start()-200):match.start()]
            if 'useCallback' not in context:
                self.add_issue(file, line_num, 'PERFORMANCE', 
                             'Função inline em prop (considere useCallback)', 
                             match.group(0)[:50])
    
    def check_state_initialization(self, file: Path, content: str):
        """Verifica inicialização de estado com objetos/arrays"""
        # Padrão: useState({...}) ou useState([...])
        patterns = [
            (r'useState\(\{[^}]+\}\)', 'useState com objeto inline'),
            (r'useState\(\[[^\]]+\]\)', 'useState com array inline'),
        ]
        
        for pattern, msg in patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                line_num = content[:match.start()].count('\n') + 1
                self.add_issue(file, line_num, 'WARNING', msg, match.group(0)[:50])
    
    def check_hook_dependencies(self, file: Path, content: str):
        """Verifica dependências de hooks"""
        # Procurar useEffect/useMemo/useCallback com dependências
        pattern = r'(useEffect|useMemo|useCallback)\([^,]+,\s*\[([^\]]*)\]'
        
        matches = re.finditer(pattern, content)
        for match in matches:
            hook_type = match.group(1)
            deps = match.group(2)
            line_num = content[:match.start()].count('\n') + 1
            
            # Verificar se tem dependências vazias quando deveria ter
            if not deps.strip() and hook_type in ['useEffect', 'useMemo']:
                self.add_issue(file, line_num, 'WARNING', 
                             f'{hook_type} com array de dependências vazio', 
                             match.group(0)[:80])
    
    def check_unstable_returns(self, file: Path, content: str):
        """Verifica se hooks retornam valores instáveis"""
        # Procurar por return { ... } em hooks customizados
        if 'export function use' not in content:
            return
            
        # Verificar se retorna objetos sem useMemo
        pattern = r'return\s*\{[^}]+\}'
        matches = re.finditer(pattern, content)
        
        for match in matches:
            line_num = content[:match.start()].count('\n') + 1
            # Verificar se está dentro de useMemo
            context = content[max(0, match.start()-300):match.start()]
            if 'useMemo' not in context and 'useCallback' not in context:
                self.add_issue(file, line_num, 'LOOP_RISK', 
                             'Hook retorna objeto sem memoização', 
                             match.group(0)[:60])
    
    def check_browser_apis(self, file: Path, content: str):
        """Verifica uso de APIs do browser"""
        patterns = [
            (r'(?<!typeof\s)window\.', 'Uso de window sem verificação'),
            (r'(?<!typeof\s)document\.', 'Uso de document sem verificação'),
        ]
        
        for pattern, msg in patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                line_num = content[:match.start()].count('\n') + 1
                # Verificar se está dentro de useEffect ou typeof check
                context = content[max(0, match.start()-100):match.start()+100]
                if 'useEffect' not in context and 'typeof window' not in context:
                    self.add_issue(file, line_num, 'HYDRATION', msg, 
                                 content.split('\n')[line_num-1].strip()[:60])
    
    def check_dynamic_values(self, file: Path, content: str):
        """Verifica valores dinâmicos que mudam entre servidor e cliente"""
        patterns = [
            (r'Date\.now\(\)', 'Date.now() causa hidratação diferente'),
            (r'Math\.random\(\)', 'Math.random() causa hidratação diferente'),
            (r'new Date\(\)', 'new Date() sem parâmetros causa hidratação diferente'),
        ]
        
        for pattern, msg in patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                line_num = content[:match.start()].count('\n') + 1
                self.add_issue(file, line_num, 'HYDRATION', msg, match.group(0))
    
    def check_storage_access(self, file: Path, content: str):
        """Verifica acesso a localStorage/cookies"""
        patterns = [
            (r'localStorage\.', 'localStorage deve ser usado apenas no cliente'),
            (r'sessionStorage\.', 'sessionStorage deve ser usado apenas no cliente'),
            (r'document\.cookie', 'document.cookie deve ser usado apenas no cliente'),
        ]
        
        for pattern, msg in patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                line_num = content[:match.start()].count('\n') + 1
                # Verificar se está dentro de useEffect
                context = content[max(0, match.start()-200):match.start()]
                if 'useEffect' not in context and 'typeof window' not in context:
                    self.add_issue(file, line_num, 'HYDRATION', msg, 
                                 content.split('\n')[line_num-1].strip()[:60])
    
    def add_issue(self, file: Path, line: int, severity: str, message: str, code: str):
        """Adiciona um problema encontrado"""
        self.issues.append({
            'file': file.relative_to(self.project_path),
            'line': line,
            'severity': severity,
            'message': message,
            'code': code
        })
    
    def generate_report(self):
        """Gera relatório final"""
        print("\n" + "="*80)
        print("📊 RELATÓRIO DE AUDITORIA")
        print("="*80 + "\n")
        
        if not self.issues:
            print("✅ Nenhum problema encontrado! Projeto está limpo.\n")
            return
        
        # Agrupar por severidade
        by_severity = {}
        for issue in self.issues:
            severity = issue['severity']
            if severity not in by_severity:
                by_severity[severity] = []
            by_severity[severity].append(issue)
        
        # Mostrar estatísticas
        print(f"Total de problemas encontrados: {len(self.issues)}\n")
        
        for severity in ['LOOP_RISK', 'HYDRATION', 'PERFORMANCE', 'WARNING']:
            if severity in by_severity:
                issues = by_severity[severity]
                icon = {'LOOP_RISK': '🔴', 'HYDRATION': '💧', 'PERFORMANCE': '⚡', 'WARNING': '⚠️'}
                print(f"{icon[severity]} {severity}: {len(issues)} problema(s)")
        
        print("\n" + "-"*80 + "\n")
        
        # Detalhar problemas críticos
        for severity in ['LOOP_RISK', 'HYDRATION']:
            if severity in by_severity:
                print(f"\n{severity} - PROBLEMAS CRÍTICOS:\n")
                for issue in by_severity[severity]:
                    print(f"📁 {issue['file']}:{issue['line']}")
                    print(f"   {issue['message']}")
                    print(f"   Código: {issue['code']}")
                    print()
        
        # Salvar relatório em arquivo
        report_path = self.project_path / 'AUDIT_REPORT.txt'
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write("RELATÓRIO DE AUDITORIA - BetterBuy\n")
            f.write("="*80 + "\n\n")
            f.write(f"Total de problemas: {len(self.issues)}\n\n")
            
            for severity in ['LOOP_RISK', 'HYDRATION', 'PERFORMANCE', 'WARNING']:
                if severity in by_severity:
                    f.write(f"\n{severity}:\n")
                    f.write("-"*80 + "\n")
                    for issue in by_severity[severity]:
                        f.write(f"\nArquivo: {issue['file']}:{issue['line']}\n")
                        f.write(f"Problema: {issue['message']}\n")
                        f.write(f"Código: {issue['code']}\n")
        
        print(f"\n💾 Relatório completo salvo em: {report_path}\n")

def main():
    project_path = r"c:\Users\David\Desktop\BetterBuy"
    
    auditor = ProjectAuditor(project_path)
    auditor.audit()
    
    print("✅ Auditoria concluída!\n")

if __name__ == "__main__":
    main()
