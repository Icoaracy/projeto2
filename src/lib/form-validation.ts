export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  info: string[];
}

export interface FormField {
  value: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: string) => string | null;
}

export const validateField = (
  fieldName: string,
  field: FormField
): { errors: string[]; warnings: string[]; info: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const info: string[] = [];

  // Validação de campo obrigatório
  if (field.required && (!field.value || field.value.trim() === '')) {
    errors.push(`${fieldName} é obrigatório`);
    return { errors, warnings, info };
  }

  // Se não tiver valor, não continua validações
  if (!field.value || field.value.trim() === '') {
    return { errors, warnings, info };
  }

  // Validação de comprimento
  if (field.minLength && field.value.length < field.minLength) {
    errors.push(`${fieldName} deve ter pelo menos ${field.minLength} caracteres`);
  }

  if (field.maxLength && field.value.length > field.maxLength) {
    errors.push(`${fieldName} deve ter no máximo ${field.maxLength} caracteres`);
  }

  // Validação de padrão
  if (field.pattern && !field.pattern.test(field.value)) {
    errors.push(`${fieldName} tem formato inválido`);
  }

  // Validação customizada
  if (field.customValidator) {
    const customError = field.customValidator(field.value);
    if (customError) {
      errors.push(customError);
    }
  }

  // Validações específicas por tipo de campo
  if (fieldName.toLowerCase().includes('email')) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value)) {
      errors.push('Email inválido');
    }
  }

  if (fieldName.toLowerCase().includes('processo') || fieldName.toLowerCase().includes('numero')) {
    const numbersOnly = field.value.replace(/\D/g, '');
    if (numbersOnly.length === 17) {
      // Simplified validation - in production, implement proper CNJ validation
      const ano = parseInt(numbersOnly.substring(0, 4));
      const currentYear = new Date().getFullYear();
      
      if (ano < 1900 || ano > currentYear + 1) {
        errors.push('Número de processo inválido - verifique o ano');
      }
    }
  }

  // Sugestões de melhoria
  if (field.value.length > 100 && !field.value.includes('\n')) {
    info.push('Considere dividir este texto em parágrafos para melhor legibilidade');
  }

  if (field.value.length > 500 && field.value.split(' ').length < 50) {
    warnings.push('Texto muito denso - considere adicionar mais detalhes');
  }

  return { errors, warnings, info };
};

export const validateForm = (formData: Record<string, any>): ValidationResult => {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  const allInfo: string[] = [];

  // Validação do número de processo
  if (formData.numeroProcesso) {
    const processValidation = validateField('Número do Processo', {
      value: formData.numeroProcesso,
      required: true,
      minLength: 17,
      maxLength: 17,
      pattern: /^\d+$/,
      customValidator: (value) => {
        if (value.length === 17) {
          const ano = parseInt(value.substring(0, 4));
          const currentYear = new Date().getFullYear();
          
          if (ano < 1900 || ano > currentYear + 1) {
            return 'Número de processo inválido - verifique os dígitos verificadores';
          }
        }
        return null;
      }
    });
    
    allErrors.push(...processValidation.errors);
    allWarnings.push(...processValidation.warnings);
    allInfo.push(...processValidation.info);
  }

  // Validação dos campos obrigatórios principais
  const requiredFields = [
    { name: 'Objeto da Aquisição', key: 'objetoAquisicao', minLength: 10 },
    { name: 'Área Requisitante', key: 'areaRequisitante', minLength: 3 },
    { name: 'Requisitante', key: 'requisitante', minLength: 3 },
    { name: 'Descrição da Solução', key: 'descricaoSolucao', minLength: 20 }
  ];

  requiredFields.forEach(field => {
    if (formData[field.key]) {
      const validation = validateField(field.name, {
        value: formData[field.key],
        required: true,
        minLength: field.minLength,
        maxLength: 2000
      });
      
      allErrors.push(...validation.errors);
      allWarnings.push(...validation.warnings);
      allInfo.push(...validation.info);
    }
  });

  // Validação das alternativas
  ['alternativa1', 'alternativa2', 'alternativa3'].forEach((altKey, index) => {
    const alt = formData[altKey];
    if (alt && (alt.descricao || alt.pontosPositivos || alt.pontosNegativos)) {
      if (!alt.descricao || alt.descricao.trim().length < 10) {
        allErrors.push(`Alternativa ${index + 1}: Descrição é muito curta`);
      }
      if (!alt.pontosPositivos || alt.pontosPositivos.trim().length < 5) {
        allWarnings.push(`Alternativa ${index + 1}: Adicione pontos positivos`);
      }
      if (!alt.pontosNegativos || alt.pontosNegativos.trim().length < 5) {
        allInfo.push(`Alternativa ${index + 1}: Considere adicionar pontos negativos`);
      }
    }
  });

  // Validação de consistência
  if (formData.valorTotalEstimacao && formData.metodoLevantamentoQuantidades) {
    if (!formData.memoriaCalculo || formData.memoriaCalculo.trim().length < 20) {
      allWarnings.push('Adicione uma memória de cálculo detalhada para justificar o valor estimado');
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    info: allInfo
  };
};

export const getFieldValidationIssues = (validationResult: ValidationResult) => {
  const issues = [];

  validationResult.errors.forEach(error => {
    const fieldName = error.split(':')[0] || 'Campo';
    issues.push({
      field: fieldName,
      message: error.split(':').slice(1).join(':').trim(),
      severity: 'error' as const
    });
  });

  validationResult.warnings.forEach(warning => {
    const fieldName = warning.split(':')[0] || 'Campo';
    issues.push({
      field: fieldName,
      message: warning.split(':').slice(1).join(':').trim(),
      severity: 'warning' as const
    });
  });

  validationResult.info.forEach(info => {
    const fieldName = info.split(':')[0] || 'Campo';
    issues.push({
      field: fieldName,
      message: info.split(':').slice(1).join(':').trim(),
      severity: 'info' as const
    });
  });

  return issues;
};