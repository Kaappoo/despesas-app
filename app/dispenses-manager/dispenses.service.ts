const DispensesService = () => {
  const saveData = async (dados: any) => {
    try {
      localStorage.setItem("dispense_data", JSON.stringify(dados));
      console.log("Dados salvos com sucesso no LocalStorage!");
    } catch (err) {
      console.error("Erro ao salvar dados no LocalStorage:", err);
    }
  };

  const searchData = async () => {
    try {
      const texto = localStorage.getItem("dispense_data");
      if (!texto) {
        return { salary: 100, dispenses: [] };
      }
      return JSON.parse(texto);
    } catch (err) {
      console.error("Erro ao buscar dados do LocalStorage:", err);
      return { salary: 100, dispenses: [] };
    }
  };
  return { saveData, searchData };
};

export default DispensesService;
