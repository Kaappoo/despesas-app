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

  const exportToFile = (data: { salary: number; groups: CategoryGroup[] }) => {
    const exportPayload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      salary: typeof data.salary === "number" ? data.salary : 500000,
      groups: data.groups || [],
    };

    const jsonString = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().slice(0, 10);

    const link = document.createElement("a");
    link.href = url;
    link.download = `despesas_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const parseImportData = (jsonString: string): { salary: number; groups: CategoryGroup[] } => {
    let parsed: any;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e) {
      throw new Error("O arquivo selecionado não é um arquivo JSON válido.");
    }

    if (!parsed || (typeof parsed !== "object" && !Array.isArray(parsed))) {
      throw new Error("O conteúdo do arquivo é inválido.");
    }

    const salary =
      typeof parsed.salary === "number" && !isNaN(parsed.salary)
        ? Math.round(parsed.salary)
        : 500000;

    // Case 1: Standard groups array present
    if (Array.isArray(parsed.groups) && parsed.groups.length > 0) {
      const validatedGroups: CategoryGroup[] = parsed.groups.map((group: any, gIndex: number) => {
        const items: ExpenseItem[] = Array.isArray(group.items)
          ? group.items.map((item: any, iIndex: number) => ({
              id: item.id ? String(item.id) : `item-${Date.now()}-${gIndex}-${iIndex}`,
              name: typeof item.name === "string" ? item.name : "",
              value: typeof item.value === "number" && !isNaN(item.value) ? item.value : 0,
            }))
          : [];

        return {
          id: group.id ? String(group.id) : `group-${Date.now()}-${gIndex}`,
          name: typeof group.name === "string" ? group.name : `Categoria ${gIndex + 1}`,
          color:
            typeof group.color === "string" && COLOR_PALETTE.includes(group.color)
              ? group.color
              : COLOR_PALETTE[gIndex % COLOR_PALETTE.length],
          items,
        };
      });

      return { salary, groups: validatedGroups };
    }

    // Case 2: Legacy dispenses array present
    if (Array.isArray(parsed.dispenses) && parsed.dispenses.length > 0) {
      const groupsMap: Record<string, ExpenseItem[]> = {};

      parsed.dispenses.forEach((item: any, idx: number) => {
        const categoryName = item.category?.trim() || "Geral";
        if (!groupsMap[categoryName]) {
          groupsMap[categoryName] = [];
        }
        groupsMap[categoryName].push({
          id: item.id ? String(item.id) : `item-${Date.now()}-${idx}`,
          name: typeof item.name === "string" ? item.name : "",
          value: typeof item.value === "number" && !isNaN(item.value) ? item.value : 0,
        });
      });

      const migratedGroups: CategoryGroup[] = Object.entries(groupsMap).map(([catName, items], index) => ({
        id: `group-${Date.now()}-${index}`,
        name: catName,
        color: COLOR_PALETTE[index % COLOR_PALETTE.length],
        items,
      }));

      return { salary, groups: migratedGroups };
    }

    // Case 3: Raw array of CategoryGroup or ExpenseItem
    if (Array.isArray(parsed)) {
      const first = parsed[0];
      if (first && Array.isArray(first.items)) {
        return parseImportData(JSON.stringify({ salary: 500000, groups: parsed }));
      } else if (first && (first.name !== undefined || first.value !== undefined)) {
        return parseImportData(JSON.stringify({ salary: 500000, dispenses: parsed }));
      }
    }

    throw new Error("Nenhuma categoria ou despesa válida foi encontrada no arquivo.");
  };

  return { saveData, searchData, exportToFile, parseImportData };
};

export default DispensesService;
