"use client";
import Modal from "react-modal";
import { IoTrash } from "react-icons/io5";
import { useEffect, useState } from "react";
import { RiseLoader } from "react-spinners";
import { FaPencilAlt } from "react-icons/fa";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { createItem, delItem, fetchItems, updateItem } from "./utills/api";

const override = {
  margin: "auto auto",
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    width: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    borderRadius: "1rem",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#000000",
  },
};

Modal.setAppElement('main')

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTask, setEditTask] = useState("");
  
  const handleChange = (event: any) => setInput(event.target.value);

  const handleSubmit = async () => {
    try {
      const response = await createItem(
        { title: input, description: "any" },
        2
      );
      fetchTasks();
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  async function fetchTasks() {
    setLoading(true);
    try {
      const response = await fetchItems(2);
      setTasks(response);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error creating item:", error);
    }
  }

  const _handleDelete = (id: number) => async () => {
    try {
      const response = await delItem(2, id);
      if (response) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  const handleTaskUpdate = async (id: number) => {
    try {
      if (selectedTask) {
        const response = await updateItem(selectedTask, 2, {
          title: editTask,
          description: "any",
        });
        if(response){
          closeModal()
          fetchTasks();
        }
      }
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  function openModal() {
    setModalIsOpen(true);
  }

  function afterOpenModal() {}

  function closeModal() {
    setModalIsOpen(false);
  }


  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <main className="flex min-h-screen flex-col p-24 h-screen w-10/12 mx-auto">
      {loading ? (
        <RiseLoader
          size={15}
          loading={true}
          color={"#3ab194ea"}
          cssOverride={override}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <>
          <ToastContainer />
          <p className="text-center text-4xl mb-5 heading">Todo</p>
          <div className="flex flex-row justify-center">
            <input
              id="task"
              type="text"
              className="input"
              onChange={handleChange}
              value={input}
            />
            <button type="button" className="btn" onClick={handleSubmit}>
              Add task
            </button>
          </div>
          <div className="mt-5 h-5/6 overflow-x-hidden overflow-y-scroll w-full">
            {tasks?.map((item) => (
              <div
                className="flex flex-row justify-between items-center mx-auto mt-2 bg-[#3ab194ea] px-4 py-2 rounded-xl cursor-pointer"
                key={`${item?.id}tasks`}
              >
                <p>{item.title}</p>
                <div className="flex flex-row justify-between items-center">
                  <button
                    className="bg-black hover:bg-slate-800 p-1 rounded-md"
                    onClick={() => {
                      setSelectedTask(item?.id);
                      setModalIsOpen(true);
                    }}
                  >
                    <FaPencilAlt color="#ffffff" />
                  </button>
                  <button
                    className="bg-black hover:bg-slate-800 p-1 rounded-md ml-2"
                    onClick={_handleDelete(item?.id)}
                  >
                    <IoTrash color="#ffffff" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <div className="h-64 flex flex-col justify-center items-center">
          <p className="text-[#3ab194ea] font-semibold text-2xl">Edit Task</p>
          <input
            type="text"
            className="bg-[#000] border-[#3ab194ea] border-2 rounded-md outline-none px-5 w-[60%] mt-10 mx-auto h-12"
            value={editTask}
            onChange={(e) => setEditTask(e.target.value)}
          />
          <div className="flex flex-row-reverse mt-10">
            <button
              type="button"
              className="w-28 h-10 rounded-lg ml-2 bg-[#3ab194ea] hover:bg-[#3ab19450]"
              onClick={handleTaskUpdate}
            >
              Save
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="w-28 h-10 rounded-lg bg-[#000] hover:bg-[#3ab19450] border-[#3ab194ea] border-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
