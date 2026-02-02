import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, Import, Key, Shield, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onCreateWallet: () => void;
  onImportWallet: (privateKey: string, address: string) => boolean;
}

export function WelcomeScreen({ onCreateWallet, onImportWallet }: WelcomeScreenProps) {
  const [privateKey, setPrivateKey] = useState('');
  const [address, setAddress] = useState('');
  const [importError, setImportError] = useState('');

  const handleImport = () => {
    setImportError('');
    if (!privateKey.trim() || !address.trim()) {
      setImportError('Completa ambos campos');
      return;
    }
    const success = onImportWallet(privateKey.trim(), address.trim());
    if (!success) {
      setImportError('Private key inválida');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25 mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">VelCoin</h1>
          <p className="text-slate-400">Tu wallet de criptomonedas</p>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
            <TabsTrigger value="create" className="data-[state=active]:bg-violet-600">
              <Wallet className="w-4 h-4 mr-2" />
              Crear
            </TabsTrigger>
            <TabsTrigger value="import" className="data-[state=active]:bg-violet-600">
              <Import className="w-4 h-4 mr-2" />
              Importar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card className="border-slate-700 bg-slate-800/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-violet-400" />
                  Nueva Wallet
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Crea una nueva wallet segura con par de claves criptográficas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-sm text-amber-400">
                    <strong>Importante:</strong> Guarda tu private key en un lugar seguro. 
                    Si la pierdes, no podrás recuperar tus fondos.
                  </p>
                </div>
                <Button 
                  onClick={onCreateWallet}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                  size="lg"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Crear Wallet
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import">
            <Card className="border-slate-700 bg-slate-800/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-violet-400" />
                  Importar Wallet
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Ingresa tu private key y address para recuperar tu wallet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Private Key</label>
                  <Input
                    type="password"
                    placeholder="0x..."
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Address</label>
                  <Input
                    placeholder="a1b2c3d4..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 font-mono text-sm"
                  />
                </div>
                {importError && (
                  <p className="text-sm text-red-400">{importError}</p>
                )}
                <Button 
                  onClick={handleImport}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                  size="lg"
                >
                  <Import className="w-4 h-4 mr-2" />
                  Importar Wallet
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-center text-slate-500 text-sm mt-6">
          Conectado a: velcoin.onrender.com
        </p>
      </div>
    </div>
  );
}
