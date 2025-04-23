import React, { useState, useEffect } from "react";
import DispensesService from "../dispenses-manager/dispenses.service";

const Dispenses = () => {
  const { saveData, searchData } = DispensesService();
  const [inputs, setInputs] = useState([
    { id: Date.now(), name: "", value: 10 },
  ]);
  const [salary, setSalary] = useState(100);
  const [totalDispenses, setTotalDispenses] = useState(0);
  const [loading, setloading] = useState(true);

  const handleChangeSalary = (newSalary: number) => {
    setSalary(newSalary);
  };

  const handleAddInput = () => {
    setInputs([...inputs, { id: Date.now(), name: "", value: 0 }]);
  };

  const handleRemoveInput = (id: number) => {
    if (inputs.length === 1) {
      setInputs([{ id: Date.now(), name: "", value: 0 }]);
      return;
    }
    const updatedInputs = inputs.filter((input) => {
      if (input && input.id !== id) return input;
    });
    setInputs(updatedInputs);
  };
  const handleInputValueChange = (id: number, newValue: number) => {
    if (isNaN(newValue)) return;
    const updatedInputs = inputs.map((input) =>
      input.id === id ? { ...input, value: newValue } : input
    );
    setInputs(updatedInputs);
  };

  const handleInputNameChange = (id: number, newName: string) => {
    const updatedInputs = inputs.map((input) =>
      input.id === id ? { ...input, name: newName } : input
    );
    setInputs(updatedInputs);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await searchData();
      if (data) {
        setInputs(data.dispenses);
        setSalary(data.salary);
        
        const total = data.dispenses.reduce(
          (acc: any, input: any) => acc + input.value,
          0
        );
        setTotalDispenses(Number(total));
        
        setloading(false);
      }
    };
    fetchData();
  }, []);
  const salvar = () => {
    const data = {
      salary: salary,
      dispenses: inputs,
    };
    saveData(data);
  };
  return (
    <>
      {!loading && <div className="flex justify-between w-full pt-8">
        <div className="flex flex-col p-4 gap-8 rounded-2xl text-blue-50 font-medium w-full">
          <div className="flex gap-2 items-end">
            <label className="flex flex-col w-1/2">
              <span className="text-lg font-semibold">Salário</span>
              <input
                className="bg-gray-900 rounded-md pt-2 pb-2 pl-3 text-blue-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                type="number"
                name="salary"
                id="salary"
                placeholder="Insira o salário.."
                onChange={(e) => handleChangeSalary(Number(e.target.value))}
                value={salary}
              />
            </label>
            <button
              type="button"
              onClick={salvar}
              className="bg-blue-500 rounded-md py-2 px-4 text-white font-bold cursor-pointer"
            >
              Salvar
            </button>
          </div>
          <div className="flex flex-col justify-center w-full max-w-2xl p-4 bg-gray-900 rounded-2xl text-blue-50 font-medium gap-4">
            <h2 className="font-bold">Dispesas</h2>
            <hr className="border-blue-50" />
            {inputs.map((input) => (
              <div key={input.id.toString()} className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 items-center justify-between">
                  <input
                    type="text"
                    name="name"
                    id={"name" + input.id.toString()}
                    placeholder="Insira o nome.."
                    className="rounded-md text-blue=50 focus-visible:outline-0"
                    onChange={(e) =>
                      handleInputNameChange(input.id, e.target.value)
                    }
                    value={input.name}
                  />
                  <button
                    onClick={() => handleRemoveInput(input.id)}
                    className="text-red-700 font-bold cursor-pointer"
                  >
                    X
                  </button>
                </div>
                <input
                  type="text"
                  name="value"
                  id={"value" + input.id.toString()}
                  placeholder="Insira o valor.."
                  className="bg-blue-50 rounded-md py-2 pl-3 text-black focus-visible:outline-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onChange={(e) =>
                    handleInputValueChange(input.id, Number(e.target.value))
                  }
                  value={input.value}
                />
              </div>
            ))}
            <button type="button" onClick={handleAddInput}>
              <span className="text-blue-50 font-bold cursor-pointer">Adicionar despesa</span>
            </button>
          </div>
        </div>
        <div
          className={`flex flex-col items-center justify-center p-3 w-full sticky top-10 h-[90vh] rounded-2xl gap-10 bg-green-800 ${
            totalDispenses > salary ? "bg-red-700" : "bg-green-800"
          }`}
        >
          <div className="flex gap-2 w-1/2 text-green-200 font-semibold text-2xl justify-between">
            <span>Salario:</span> <span>R$ {salary.toFixed(2)}</span>
          </div>
          <div className="flex gap-2 w-1/2 text-green-200 font-semibold text-2xl justify-between">
            <span>Gasto total:</span> R$ {totalDispenses.toFixed(2)}
          </div>
          <div className="flex gap-2 w-1/2 text-green-200 font-semibold text-2xl justify-between">
            <span>Saldo:</span> R$ {(salary - totalDispenses).toFixed(2)}
          </div>
        </div>
      </div>}
    </>
  );
};

export default Dispenses;
