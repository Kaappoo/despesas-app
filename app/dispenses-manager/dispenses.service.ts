const DispensesService = () => {
    const saveData = async (dados: any) => {
      try {
        const answer = await fetch("http://localhost:3001/salvar-dados", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        });
    
        const texto = await answer.text();
        console.log(texto);
      } catch (err) {
        console.error("Erro ao salvar dados:", err);
      }
    };

    const searchData = async () => {
      try {
        const answer = await fetch("http://localhost:3001/buscar-dados", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const texto = await answer.text();
        
        return JSON.parse(texto);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    }
    return {saveData, searchData};
}

export default DispensesService;
