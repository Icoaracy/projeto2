import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showSuccess, showError } from "@/utils/toast";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { SecurityStatus } from "@/components/security-status";
import { Mail, Phone, MapPin, Star, Zap, Shield, AlertTriangle, FileText, Search, CheckCircle, TrendingUp } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useSecurity } from "@/hooks/use-security";
import { validateFormInput } from "@/lib/security";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { canMakeRequest, updateRateLimitStatus } = useSecurity();

  // Enhanced client-side validation using security utilities
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate name
    const nameValidation = validateFormInput(formData.name, 'name');
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error || 'Nome inválido';
    }

    // Validate email
    const emailValidation = validateFormInput(formData.email, 'email');
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error || 'Email inválido';
    }

    // Validate message
    const messageValidation = validateFormInput(formData.message, 'message');
    if (!messageValidation.isValid) {
      newErrors.message = messageValidation.error || 'Mensagem inválida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limit before proceeding
    if (!canMakeRequest()) {
      showError("Limite de requisições excedido. Por favor, aguarde antes de tentar novamente.");
      return;
    }
    
    // Validate form on client side first
    if (!validateForm()) {
      showError("Por favor, corrija os erros no formulário");
      return;
    }

    setIsSubmitting(true);

    try {
      // Use secure API endpoint
      const response = await apiClient.post('/api/contact', formData);
      
      if (response.success) {
        showSuccess(response.message || "Formulário enviado com sucesso!");
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
        // Update rate limit status after successful submission
        await updateRateLimitStatus();
      } else {
        showError(response.error || "Falha ao enviar formulário");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Falha ao enviar formulário. Tente novamente.";
      showError(errorMessage);
      // Update rate limit status after error
      await updateRateLimitStatus();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Análise de Artefatos de
            <span className="text-blue-600"> Licitação</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Plataforma inteligente para análise automatizada de documentos de licitação. 
            Garanta conformidade e eficiência em seus processos licitatórios com tecnologia de ponta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={() => navigate("/create-artifact")}
            >
              Criar Artefato
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Analisar artefato
            </Button>
          </div>
        </div>
      </section>

      {/* Security Notice */}
      <section className="py-8 px-4 bg-blue-50 border-y border-blue-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-blue-800">
            <Shield className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Segurança Avançada Ativa</h3>
              <p className="text-sm text-blue-700">
                Esta aplicação utiliza Política de Segurança de Conteúdo (CSP), rate limiting robusto, 
                proteção CSRF e validação abrangente para proteger seus dados de licitação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Recursos Principais
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Análise de Editais</h3>
              <p className="text-sm text-gray-600">Processamento automático de documentos de licitação</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Verificação de Conformidade</h3>
              <p className="text-sm text-gray-600">Validação automática contra requisitos legais</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Processamento Rápido</h3>
              <p className="text-sm text-gray-600">Análise em minutos, não em horas</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Relatórios Detalhados</h3>
              <p className="text-sm text-gray-600">Insights acionáveis para melhorar propostas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Entre em Contato
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Inicie uma Conversa</h3>
              <p className="text-gray-600 mb-8">
                Tem dúvidas sobre nossa plataforma de análise de licitações? 
                Quer ver uma demonstração? Preencha o formulário e nossa equipe 
                retornará em até 24 horas.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">contato@licitacao-analise.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">+55 (11) 3456-7890</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">São Paulo, SP - Brasil</span>
                </div>
              </div>
              
              {/* Security Status */}
              <div className="mt-8">
                <SecurityStatus showRateLimit={true} showCSRF={true} />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Envie sua mensagem</CardTitle>
                <CardDescription>
                  Gostaríamos de saber mais sobre suas necessidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={errors.name ? "border-red-500" : ""}
                      maxLength={100}
                      required
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "border-red-500" : ""}
                      maxLength={254}
                      required
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Como podemos ajudar com suas análises de licitação..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className={errors.message ? "border-red-500" : ""}
                      rows={4}
                      maxLength={2000}
                      required
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {formData.message.length}/2000 caracteres
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || !canMakeRequest()}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Pronto para Otimizar Suas Licitações?</h3>
          <p className="text-gray-400 mb-6">Junte-se a centenas de empresas que aumentaram seu sucesso</p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Iniciar Teste Gratuito
          </Button>
        </div>
      </footer>

      <MadeWithDyad />
    </div>
  );
};

export default Index;