export interface ExpenseItem {
  id: string;
  name: string;
  value: number;
}

export interface CategoryGroup {
  id: string;
  name: string;
  color: string;
  items: ExpenseItem[];
}

const COLOR_PALETTE = ["blue", "emerald", "amber", "purple", "rose", "cyan", "indigo", "orange"];

const DispensesService = () => {
  const saveData = async (dados: { salary: number; groups: CategoryGroup[] }) => {
    try {
      localStorage.setItem("dispense_data", JSON.stringify(dados));
      console.log("Dados salvos com sucesso no LocalStorage!");
    } catch (err) {
      console.error("Erro ao salvar dados no LocalStorage:", err);
    }
  };

  const searchData = async (): Promise<{ salary: number; groups: CategoryGroup[] }> => {
    try {
      const texto = localStorage.getItem("dispense_data");
      if (!texto) {
        return getDefaultData();
      }

      const data = JSON.parse(texto);
      if (data && Array.isArray(data.groups) && data.groups.length > 0) {
        return {
          salary: typeof data.salary === "number" ? data.salary : 100,
          groups: data.groups,
        };
      }

      // Migrate from legacy dispenses array if present
      if (data && Array.isArray(data.dispenses) && data.dispenses.length > 0) {
        const groupsMap: Record<string, ExpenseItem[]> = {};

        data.dispenses.forEach((item: any) => {
          const categoryName = item.category?.trim() || "Geral";
          if (!groupsMap[categoryName]) {
            groupsMap[categoryName] = [];
          }
          groupsMap[categoryName].push({
            id: item.id ? String(item.id) : `item-${Date.now()}-${Math.random()}`,
            name: item.name || "",
            value: typeof item.value === "number" ? item.value : 0,
          });
        });

        const migratedGroups: CategoryGroup[] = Object.entries(groupsMap).map(([catName, items], index) => ({
          id: `group-${Date.now()}-${index}`,
          name: catName,
          color: COLOR_PALETTE[index % COLOR_PALETTE.length],
          items: items,
        }));

        return {
          salary: typeof data.salary === "number" ? data.salary : 100,
          groups: migratedGroups,
        };
      }

      return getDefaultData();
    } catch (err) {
      console.error("Erro ao buscar dados do LocalStorage:", err);
      return getDefaultData();
    }
  };

  const getDefaultData = (): { salary: number; groups: CategoryGroup[] } => ({
    salary: 500000, // R$ 5.000,00 default
    groups: [
      {
        id: "group-moradia",
        name: "Moradia & Fixas",
        color: "blue",
        items: [
          { id: "item-1", name: "Aluguel / Condomínio", value: 150000 },
          { id: "item-2", name: "Conta de Luz / Água", value: 25000 },
        ],
      },
      {
        id: "group-alimentacao",
        name: "Alimentação & Mercado",
        color: "emerald",
        items: [{ id: "item-3", name: "Supermercado", value: 80000 }],
      },
    ],
  });

  return { saveData, searchData };
};

export default DispensesService;
