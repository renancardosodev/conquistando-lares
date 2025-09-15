import React, { useState } from 'react';
import { db, storage } from '../data/firebase'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const estados = [
  { nome: 'Rio de Janeiro', sigla: 'RJ' }
];

function CadastroAnimal() {
  const [formData, setFormData] = useState({
    nome: '',
    categoria: 'cachorros',
    idade: '',
    descricao: '',
    abrigo: '',
    contato: '',
    bairro: '',
    estado: 'RJ',
    sexo: 'M',
    imagem: null, 
    fotosExtras: [], 
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e) {
    const { name, files } = e.target;
    if(name === 'imagem') {
      setFormData(prev => ({ ...prev, imagem: files[0] }));
    } else if(name === 'fotosExtras') {
      setFormData(prev => ({ ...prev, fotosExtras: Array.from(files) }));
    }
  }

  async function uploadFile(file, path) {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Upload imagem principal
      const imagemUrl = await uploadFile(formData.imagem, `animais/${formData.nome}_principal_${Date.now()}`);

      // 2. Upload fotos extras
      const fotosExtrasUrls = [];
      for(const file of formData.fotosExtras) {
        const url = await uploadFile(file, `animais/${formData.nome}_extra_${Date.now()}_${file.name}`);
        fotosExtrasUrls.push(url);
      }

      // 3. Montar objeto para salvar
      const animalData = {
        nome: formData.nome,
        categoria: formData.categoria,
        idade: formData.idade,
        descricao: formData.descricao,
        abrigo: formData.abrigo,
        contato: formData.contato,
        bairro: formData.bairro,
        estado: formData.estado,
        sexo: formData.sexo,
        imagem: imagemUrl,
        fotosExtras: fotosExtrasUrls,
      };

      // 4. Salvar no Firestore
      await addDoc(collection(db, 'animais'), animalData);

      alert('Animal cadastrado com sucesso!');
      setFormData({
        nome: '',
        categoria: 'cachorros',
        idade: '',
        descricao: '',
        abrigo: '',
        contato: '',
        bairro: '',
        estado: 'RJ',
        sexo: 'M',
        imagem: null,
        fotosExtras: [],
      });
    } catch (error) {
      console.error('Erro ao cadastrar animal:', error);
      alert('Erro ao cadastrar animal. Tente novamente.');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
      <select name="categoria" value={formData.categoria} onChange={handleChange}>
        <option value="cachorros">Cachorros</option>
        <option value="gatos">Gatos</option>
        <option value="passaros">Pássaros</option>
        <option value="roedores">Roedores</option>
      </select>
      <input name="idade" placeholder="Idade" value={formData.idade} onChange={handleChange} />
      <textarea name="descricao" placeholder="Descrição" value={formData.descricao} onChange={handleChange} />
      <input name="abrigo" placeholder="Abrigo" value={formData.abrigo} onChange={handleChange} />
      <input name="contato" placeholder="Contato" value={formData.contato} onChange={handleChange} />
      <input name="bairro" placeholder="Bairro" value={formData.bairro} onChange={handleChange} />
      <select name="estado" value={formData.estado} onChange={handleChange}>
        {estados.map(e => (
          <option key={e.sigla} value={e.sigla}>{e.nome}</option>
        ))}
      </select>

      <div>
        Sexo:
        <label>
          <input type="radio" name="sexo" value="M" checked={formData.sexo === 'M'} onChange={handleChange} /> M
        </label>
        <label>
          <input type="radio" name="sexo" value="F" checked={formData.sexo === 'F'} onChange={handleChange} /> F
        </label>
      </div>

      <label>Imagem principal:</label>
      <input type="file" name="imagem" accept="image/*" onChange={handleFileChange} required />

      <label>Fotos extras:</label>
      <input type="file" name="fotosExtras" accept="image/*" multiple onChange={handleFileChange} />

      <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Cadastrar Animal'}</button>
    </form>
  );
}

export default CadastroAnimal;
