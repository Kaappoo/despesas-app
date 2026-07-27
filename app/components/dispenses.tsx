import React, { useState, useEffect, useMemo } from "react";
import DispensesService, {
  type CategoryGroup,
  type ExpenseItem,
} from "../dispenses-manager/dispenses.service";
import { NumericFormat } from "react-number-format";

interface ColorTheme {
  name: string;
  boxBorder: string;
  boxBg: string;
  headerBg: string;
  headerText: string;
  badgeBg: string;
  badgeText: string;
  barBg: string;
  dragRing: string;
  dotBg: string;
}

const COLOR_PALETTE: Record<string, ColorTheme> = {
  blue: {
    name: "Azul",
    boxBorder: "border-blue-500/40",
    boxBg: "bg-blue-950/30",
    headerBg: "bg-blue-900/50",
    headerText: "text-blue-200",
    badgeBg: "bg-blue-500/20",
    badgeText: "text-blue-300 border border-blue-500/30",
    barBg: "bg-blue-400",
    dragRing: "ring-2 ring-blue-400 bg-blue-900/50",
    dotBg: "bg-blue-500",
  },
  emerald: {
    name: "Verde",
    boxBorder: "border-emerald-500/40",
    boxBg: "bg-emerald-950/30",
    headerBg: "bg-emerald-900/50",
    headerText: "text-emerald-200",
    badgeBg: "bg-emerald-500/20",
    badgeText: "text-emerald-300 border border-emerald-500/30",
    barBg: "bg-emerald-400",
    dragRing: "ring-2 ring-emerald-400 bg-emerald-900/50",
    dotBg: "bg-emerald-500",
  },
  amber: {
    name: "Amarelo",
    boxBorder: "border-amber-500/40",
    boxBg: "bg-amber-950/30",
    headerBg: "bg-amber-900/50",
    headerText: "text-amber-200",
    badgeBg: "bg-amber-500/20",
    badgeText: "text-amber-300 border border-amber-500/30",
    barBg: "bg-amber-400",
    dragRing: "ring-2 ring-amber-400 bg-amber-900/50",
    dotBg: "bg-amber-500",
  },
  purple: {
    name: "Roxo",
    boxBorder: "border-purple-500/40",
    boxBg: "bg-purple-950/30",
    headerBg: "bg-purple-900/50",
    headerText: "text-purple-200",
    badgeBg: "bg-purple-500/20",
    badgeText: "text-purple-300 border border-purple-500/30",
    barBg: "bg-purple-400",
    dragRing: "ring-2 ring-purple-400 bg-purple-900/50",
    dotBg: "bg-purple-500",
  },
  rose: {
    name: "Rosa",
    boxBorder: "border-rose-500/40",
    boxBg: "bg-rose-950/30",
    headerBg: "bg-rose-900/50",
    headerText: "text-rose-200",
    badgeBg: "bg-rose-500/20",
    badgeText: "text-rose-300 border border-rose-500/30",
    barBg: "bg-rose-400",
    dragRing: "ring-2 ring-rose-400 bg-rose-900/50",
    dotBg: "bg-rose-500",
  },
  cyan: {
    name: "Ciano",
    boxBorder: "border-cyan-500/40",
    boxBg: "bg-cyan-950/30",
    headerBg: "bg-cyan-900/50",
    headerText: "text-cyan-200",
    badgeBg: "bg-cyan-500/20",
    badgeText: "text-cyan-300 border border-cyan-500/30",
    barBg: "bg-cyan-400",
    dragRing: "ring-2 ring-cyan-400 bg-cyan-900/50",
    dotBg: "bg-cyan-500",
  },
  indigo: {
    name: "Índigo",
    boxBorder: "border-indigo-500/40",
    boxBg: "bg-indigo-950/30",
    headerBg: "bg-indigo-900/50",
    headerText: "text-indigo-200",
    badgeBg: "bg-indigo-500/20",
    badgeText: "text-indigo-300 border border-indigo-500/30",
    barBg: "bg-indigo-400",
    dragRing: "ring-2 ring-indigo-400 bg-indigo-900/50",
    dotBg: "bg-indigo-500",
  },
  orange: {
    name: "Laranja",
    boxBorder: "border-orange-500/40",
    boxBg: "bg-orange-950/30",
    headerBg: "bg-orange-900/50",
    headerText: "text-orange-200",
    badgeBg: "bg-orange-500/20",
    badgeText: "text-orange-300 border border-orange-500/30",
    barBg: "bg-orange-400",
    dragRing: "ring-2 ring-orange-400 bg-orange-900/50",
    dotBg: "bg-orange-500",
  },
};

const COLOR_KEYS = Object.keys(COLOR_PALETTE);

const Dispenses = () => {
  const { saveData, searchData } = DispensesService();
  const [groups, setGroups] = useState<CategoryGroup[]>([]);
  const [salary, setSalary] = useState(500000);
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<{
    itemId: string;
    sourceGroupId: string;
  } | null>(null);
  const [dragOverGroupId, setDragOverGroupId] = useState<string | null>(null);

  const fetchData = async () => {
    const data = await searchData();
    if (data) {
      setSalary(data.salary);
      setGroups(data.groups);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalDispenses = useMemo(() => {
    return groups.reduce((totalAcc, group) => {
      const groupSum = group.items.reduce(
        (gAcc, item) => gAcc + (Number(item.value) || 0),
        0
      );
      return totalAcc + groupSum;
    }, 0);
  }, [groups]);

  const groupSums = useMemo(() => {
    const map: Record<string, number> = {};
    groups.forEach((group) => {
      map[group.id] = group.items.reduce(
        (acc, item) => acc + (Number(item.value) || 0),
        0
      );
    });
    return map;
  }, [groups]);

  const handleSalaryChange = (newSalary: number) => {
    setSalary(newSalary);
  };

  const handleAddGroup = () => {
    const newColor = COLOR_KEYS[groups.length % COLOR_KEYS.length];
    const newGroup: CategoryGroup = {
      id: `group-${Date.now()}`,
      name: `Nova Categoria ${groups.length + 1}`,
      color: newColor,
      items: [
        {
          id: `item-${Date.now()}`,
          name: "",
          value: 0,
        },
      ],
    };
    setGroups([...groups, newGroup]);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (groups.length <= 1) {
      setGroups([
        {
          id: `group-${Date.now()}`,
          name: "Geral",
          color: "blue",
          items: [{ id: `item-${Date.now()}`, name: "", value: 0 }],
        },
      ]);
      return;
    }
    setGroups(groups.filter((g) => g.id !== groupId));
  };

  const handleUpdateGroupName = (groupId: string, newName: string) => {
    setGroups(
      groups.map((g) => (g.id === groupId ? { ...g, name: newName } : g))
    );
  };

  const handleUpdateGroupColor = (groupId: string, newColor: string) => {
    setGroups(
      groups.map((g) => (g.id === groupId ? { ...g, color: newColor } : g))
    );
  };

  const handleAddItemToGroup = (groupId: string) => {
    setGroups(
      groups.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            items: [
              ...g.items,
              { id: `item-${Date.now()}`, name: "", value: 0 },
            ],
          };
        }
        return g;
      })
    );
  };

  const handleRemoveItem = (groupId: string, itemId: string) => {
    setGroups(
      groups.map((g) => {
        if (g.id === groupId) {
          const updatedItems = g.items.filter((item) => item.id !== itemId);
          return {
            ...g,
            items:
              updatedItems.length > 0
                ? updatedItems
                : [{ id: `item-${Date.now()}`, name: "", value: 0 }],
          };
        }
        return g;
      })
    );
  };

  const handleItemNameChange = (
    groupId: string,
    itemId: string,
    newName: string
  ) => {
    setGroups(
      groups.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            items: g.items.map((item) =>
              item.id === itemId ? { ...item, name: newName } : item
            ),
          };
        }
        return g;
      })
    );
  };

  const handleItemValueChange = (
    groupId: string,
    itemId: string,
    newValue: number
  ) => {
    if (isNaN(newValue)) return;
    setGroups(
      groups.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            items: g.items.map((item) =>
              item.id === itemId ? { ...item, value: newValue } : item
            ),
          };
        }
        return g;
      })
    );
  };

  const handleMoveItemToGroup = (
    itemId: string,
    sourceGroupId: string,
    targetGroupId: string
  ) => {
    if (sourceGroupId === targetGroupId) return;

    let targetItem: ExpenseItem | undefined;

    const updatedGroups = groups.map((g) => {
      if (g.id === sourceGroupId) {
        targetItem = g.items.find((i) => i.id === itemId);
        const filtered = g.items.filter((i) => i.id !== itemId);
        return {
          ...g,
          items:
            filtered.length > 0
              ? filtered
              : [{ id: `item-${Date.now()}`, name: "", value: 0 }],
        };
      }
      return g;
    });

    if (!targetItem) return;

    const finalGroups = updatedGroups.map((g) => {
      if (g.id === targetGroupId) {
        return {
          ...g,
          items: [...g.items, targetItem!],
        };
      }
      return g;
    });

    setGroups(finalGroups);
  };

  // Drag and Drop Handlers
  const handleDragStart = (
    e: React.DragEvent,
    itemId: string,
    sourceGroupId: string
  ) => {
    setDraggedItem({ itemId, sourceGroupId });
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ itemId, sourceGroupId })
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, groupId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverGroupId !== groupId) {
      setDragOverGroupId(groupId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, groupId: string) => {
    if (dragOverGroupId === groupId) {
      setDragOverGroupId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetGroupId: string) => {
    e.preventDefault();
    setDragOverGroupId(null);

    let itemId = draggedItem?.itemId;
    let sourceGroupId = draggedItem?.sourceGroupId;

    if (!itemId || !sourceGroupId) {
      try {
        const raw = e.dataTransfer.getData("text/plain");
        if (raw) {
          const parsed = JSON.parse(raw);
          itemId = parsed.itemId;
          sourceGroupId = parsed.sourceGroupId;
        }
      } catch (err) {
        console.error("Error parsing drop data:", err);
      }
    }

    if (itemId && sourceGroupId) {
      handleMoveItemToGroup(itemId, sourceGroupId, targetGroupId);
    }
    setDraggedItem(null);
  };

  const salvar = () => {
    saveData({ salary, groups }).then(() => {
      fetchData();
    });
  };

  return (
    <>
      {!loading && (
        <div className="flex flex-col xl:flex-row justify-between w-full pt-4 xl:pt-8 gap-8 xl:gap-6 xl:px-0">
          {/* Left / Main Section: Category Group Boxes */}
          <div className="flex flex-col p-4 gap-6 rounded-2xl text-blue-50 font-medium w-full xl:w-2/3">
            {/* Top Bar: Salary & Actions */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-end justify-between bg-gray-900 p-4 rounded-2xl border border-gray-800 shadow-lg">
              <label className="flex flex-col w-full sm:w-1/2">
                <span className="text-lg font-semibold mb-1 text-gray-200">
                  Salário Mensal
                </span>
                <NumericFormat
                  className="bg-gray-800 rounded-xl py-2.5 px-4 text-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale={true}
                  allowNegative={false}
                  value={salary / 100}
                  name="salary"
                  id="salary"
                  placeholder="Insira o salário.."
                  onValueChange={(values) => {
                    const valueAsInteger = values.floatValue
                      ? Math.round(values.floatValue * 100)
                      : 0;
                    handleSalaryChange(Number(valueAsInteger));
                  }}
                />
              </label>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleAddGroup}
                  className="flex-1 sm:flex-none bg-indigo-600/80 hover:bg-indigo-600 transition-all duration-200 rounded-xl py-2.5 px-4 text-white font-bold cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-500/20"
                >
                  <span>+ Criar Categoria</span>
                </button>
                <button
                  type="button"
                  onClick={salvar}
                  className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 transition-all duration-200 rounded-xl py-2.5 px-6 text-white font-bold cursor-pointer shadow-md hover:shadow-blue-500/20"
                >
                  Salvar
                </button>
              </div>
            </div>

            {/* Category Group Colored Boxes Grid */}
            <div className="flex flex-col gap-6">
              {groups.map((group) => {
                const theme = COLOR_PALETTE[group.color] || COLOR_PALETTE.blue;
                const groupSum = groupSums[group.id] || 0;
                const isDragTarget = dragOverGroupId === group.id;

                return (
                  <div
                    key={group.id}
                    onDragOver={(e) => handleDragOver(e, group.id)}
                    onDragLeave={(e) => handleDragLeave(e, group.id)}
                    onDrop={(e) => handleDrop(e, group.id)}
                    className={`flex flex-col rounded-2xl border transition-all duration-200 overflow-hidden shadow-xl ${
                      theme.boxBorder
                    } ${theme.boxBg} ${
                      isDragTarget ? theme.dragRing + " scale-[1.01]" : ""
                    }`}
                  >
                    {/* Colored Box Header */}
                    <div
                      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-3 border-b ${theme.boxBorder} ${theme.headerBg}`}
                    >
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <span
                          className={`w-3.5 h-3.5 rounded-full ${theme.dotBg} shrink-0`}
                        />
                        <input
                          type="text"
                          value={group.name}
                          onChange={(e) =>
                            handleUpdateGroupName(group.id, e.target.value)
                          }
                          placeholder="Nome da Categoria..."
                          className={`bg-transparent font-bold text-xl focus:outline-none border-b border-transparent hover:border-gray-500 focus:border-white w-full sm:w-72 ${theme.headerText}`}
                        />
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                        {/* Color Selector */}
                        <div className="flex items-center gap-1.5 bg-gray-950/40 px-2 py-1 rounded-lg border border-gray-800">
                          {COLOR_KEYS.map((colorKey) => (
                            <button
                              key={colorKey}
                              type="button"
                              onClick={() =>
                                handleUpdateGroupColor(group.id, colorKey)
                              }
                              className={`w-4 h-4 rounded-full transition-transform ${
                                COLOR_PALETTE[colorKey].dotBg
                              } ${
                                group.color === colorKey
                                  ? "ring-2 ring-white scale-110"
                                  : "opacity-60 hover:opacity-100"
                              }`}
                              title={COLOR_PALETTE[colorKey].name}
                            />
                          ))}
                        </div>

                        {/* Group Total Badge */}
                        <div
                          className={`px-3 py-1.5 rounded-xl font-bold text-sm ${theme.badgeBg} ${theme.badgeText}`}
                        >
                          Soma: R${" "}
                          {(groupSum / 100).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </div>

                        {/* Delete Group Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteGroup(group.id)}
                          className="text-red-400 hover:text-red-300 font-bold p-1 rounded-lg hover:bg-red-500/20 transition-colors"
                          title="Excluir Categoria"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Group Items Container */}
                    <div className="flex flex-col p-4 gap-3">
                      {group.items.map((item) => (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={(e) =>
                            handleDragStart(e, item.id, group.id)
                          }
                          className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-gray-900/90 hover:bg-gray-900 rounded-xl border border-gray-800 shadow-sm transition-all group cursor-grab active:cursor-grabbing"
                        >
                          {/* Drag Handle Icon */}
                          <div
                            className="text-gray-500 hover:text-gray-300 cursor-grab font-bold text-lg select-none px-1"
                            title="Arraste para mover de categoria"
                          >
                            ⋮⋮
                          </div>

                          {/* Expense Name */}
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              handleItemNameChange(
                                group.id,
                                item.id,
                                e.target.value
                              )
                            }
                            placeholder="Nome da despesa..."
                            className="bg-transparent border-b border-gray-800 focus:border-blue-400 text-blue-50 focus-visible:outline-none w-full sm:w-1/2 py-1 font-medium placeholder:text-gray-600"
                          />

                          {/* Category Move Selector (Mobile view only) */}
                          {groups.length > 1 && (
                            <select
                              value={group.id}
                              onChange={(e) =>
                                handleMoveItemToGroup(
                                  item.id,
                                  group.id,
                                  e.target.value
                                )
                              }
                              className="sm:hidden bg-gray-950 border border-gray-800 text-gray-400 hover:text-gray-200 text-xs rounded-lg py-1.5 px-2 focus:outline-none w-full cursor-pointer"
                              title="Mover para categoria"
                            >
                              {groups.map((g) => (
                                <option key={g.id} value={g.id}>
                                  ➔ {g.name}
                                </option>
                              ))}
                            </select>
                          )}

                          {/* Expense Amount */}
                          <div className="flex items-center gap-2 w-full sm:w-1/2 justify-end">
                            <NumericFormat
                              className="bg-blue-50 rounded-lg py-1.5 px-3 text-black focus-visible:outline-none font-semibold text-right w-full sm:w-40"
                              id={"value-" + item.id}
                              thousandSeparator="."
                              decimalSeparator=","
                              prefix="R$ "
                              decimalScale={2}
                              fixedDecimalScale={true}
                              allowNegative={false}
                              value={item.value / 100}
                              onValueChange={(values) => {
                                const valueAsInteger = values.floatValue
                                  ? Math.round(values.floatValue * 100)
                                  : 0;
                                handleItemValueChange(
                                  group.id,
                                  item.id,
                                  valueAsInteger
                                );
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(group.id, item.id)}
                              className="text-red-400 hover:text-red-300 font-bold p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                              title="Remover despesa"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add Expense Button for this specific Group Box */}
                      <button
                        type="button"
                        onClick={() => handleAddItemToGroup(group.id)}
                        className={`mt-1 py-2 px-4 border border-dashed ${theme.boxBorder} hover:bg-gray-900/60 rounded-xl text-center transition-colors cursor-pointer flex items-center justify-center gap-2`}
                      >
                        <span className={`font-bold text-sm ${theme.headerText}`}>
                          + Adicionar despesa em "{group.name}"
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Financial Summary & Category Breakdown Cards */}
          <div className="w-full xl:w-1/3 flex flex-col gap-6">
            <div
              className={`flex flex-col p-6 w-full xl:sticky xl:top-10 h-auto rounded-2xl gap-6 transition-colors duration-300 shadow-2xl ${
                totalDispenses > salary
                  ? "bg-red-950/90 border border-red-800"
                  : "bg-gray-900 border border-gray-800"
              }`}
            >
              <h2 className="text-2xl font-bold text-blue-50 border-b border-gray-800 pb-3">
                Resumo Financeiro
              </h2>

              {/* Overview Stats */}
              <div className="flex flex-col gap-3">
                <div className="flex gap-2 w-full text-green-300 font-semibold text-lg justify-between items-center bg-gray-950/60 p-3.5 rounded-xl border border-gray-800">
                  <span>Salário:</span>
                  <span>
                    R${" "}
                    {(salary / 100).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex gap-2 w-full text-amber-300 font-semibold text-lg justify-between items-center bg-gray-950/60 p-3.5 rounded-xl border border-gray-800">
                  <span>Gasto Total:</span>
                  <span>
                    R${" "}
                    {(totalDispenses / 100).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex gap-2 w-full font-semibold text-lg justify-between items-center bg-gray-950/60 p-3.5 rounded-xl border border-gray-800">
                  <span
                    className={
                      salary - totalDispenses < 0
                        ? "text-red-400"
                        : "text-emerald-300"
                    }
                  >
                    Saldo:
                  </span>
                  <span
                    className={
                      salary - totalDispenses < 0
                        ? "text-red-400"
                        : "text-emerald-300"
                    }
                  >
                    R${" "}
                    {((salary - totalDispenses) / 100).toLocaleString(
                      "pt-BR",
                      { minimumFractionDigits: 2 }
                    )}
                  </span>
                </div>
              </div>

              {/* Category Breakdown list */}
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <h3 className="text-lg font-bold text-blue-100">
                    Soma por Categoria
                  </h3>
                  <span className="text-xs text-gray-400 font-medium">
                    {groups.length} {groups.length === 1 ? "grupo" : "grupos"}
                  </span>
                </div>

                {groups.length === 0 || totalDispenses === 0 ? (
                  <p className="text-gray-400 text-sm italic">
                    Nenhuma despesa registrada.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {groups
                      .map((group) => {
                        const sum = groupSums[group.id] || 0;
                        const percentage =
                          totalDispenses > 0 ? (sum / totalDispenses) * 100 : 0;
                        const theme =
                          COLOR_PALETTE[group.color] || COLOR_PALETTE.blue;
                        return { group, sum, percentage, theme };
                      })
                      .sort((a, b) => b.sum - a.sum)
                      .map(({ group, sum, percentage, theme }) => (
                        <div
                          key={group.id}
                          className={`flex flex-col gap-1.5 p-3 rounded-xl border ${theme.boxBorder} ${theme.boxBg}`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${theme.dotBg}`}
                              />
                              <span className={`font-semibold ${theme.headerText}`}>
                                {group.name || "Sem Nome"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-400">
                                {percentage.toFixed(1)}%
                              </span>
                              <span className="font-bold text-white text-sm">
                                R${" "}
                                {(sum / 100).toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                          </div>
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-950/80 rounded-full h-2 overflow-hidden border border-gray-800">
                            <div
                              className={`h-full ${theme.barBg} transition-all duration-300`}
                              style={{
                                width: `${Math.min(percentage, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dispenses;
