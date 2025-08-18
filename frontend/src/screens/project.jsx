import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios";
import { UserContext } from "../context/user.context.jsx";
import {
  InitialiseSocket,
  recieveMessage,
  sendingMessage,
} from "../config/socket";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js";
// import 'highlight.js/styles/github.css';
import "highlight.js/styles/atom-one-dark.css"; // or any other theme
window.hljs = hljs; //
import { getWebContainer } from "../config/webcontainer";

const OpenProject = () => {
  const location = useLocation();
  const { project } = location.state || {};
  const { user: loginUser } = useContext(UserContext);
  const messageBoxRef = useRef();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [userList, setUserList] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]); // To store project members
  const [sendMessage, setsendMessage] = useState(""); // To manage sending message state
  const [Messages, setMessages] = useState([]);

  const [fileTree, setFileTree] = useState({}); // To manage file tree structure

  const [currentfile, setcurrentfile] = useState(null);
  const [openedFiles, setOpenedFiles] = useState([]); // Track opened files
  const [webContainer, setWebContainer] = useState(null);
  const [iframeUrl, setIframeUrl] = useState(""); // To manage iframe URL
  const [runProcess, setRunProcess] = useState(null); // To manage run process
  const [serverReadySet, setServerReadySet] = useState(false);
  const [isNPM, setIsNPM] = useState("");
  // To toggle the check icon

  


  useEffect(() => {
    InitialiseSocket(project._id);

    const initWebContainer = async () => {

       if (webContainer===null) {
        const container = await getWebContainer();
        setWebContainer(container);
        console.log(" WebContainer started");
      }

    };

    initWebContainer();
    // -----------------------------------------------------

    recieveMessage("project-message", (data) => {
      
      if (data.sender._id === "ai") {

       
        const text = data.message.replace(/^```json|```$/g, "").trim();
        const cleanJson = text.replace(/\\(?!["\\/bfnrtu])/g, '\\\\');
        const text2 = cleanJson.replace(/[\u200B-\u200D\uFEFF]/g, "");

        const aiMessage = JSON.parse(text2);
        console.log("Sucessfully parsed:", aiMessage);
        if (aiMessage.buildCommand) {
          setIsNPM(aiMessage.buildCommand.mainItem);
        }

        if (aiMessage.fileTree) {
          webContainer?.mount(aiMessage.fileTree);
          setOpenedFiles([]);
          setFileTree(aiMessage.fileTree);
        }
      }

      setMessages((prevMessages) => [...prevMessages, data]);

      // console.log("Received :", data);
      scrollToBottom();
    });
    // member of project
      axios.get(`/project/getProject/${project._id}`).then((res) => {
      setProjectMembers(res.data.users);
    });

    // Fetch users from the backend
    axios
      .get("/user/all")
      .then((response) => {
        setUserList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  function SyntaxHighlightedCode(props) {
    const ref = useRef(null);

    React.useEffect(() => {
      if (ref.current && props.className?.includes("lang-") && window.hljs) {
        window.hljs.highlightElement(ref.current);

        // hljs won't reprocess the element unless this attribute is removed
        // ref.current.removeAttribute('data-highlighted')
      }
    }, [props.className, props.children]);

    return <code {...props} ref={ref} />;
  }

  //  HTML PREVIEW
  const previewRef = useRef();
  // async function Preview(fileTree) {
  //   try {
  //     if (!webContainer) {
  //       console.error("WebContainer not initialized");
  //       return;
  //     }

  //     if (runProcess) {
  //       runProcess.kill();
  //     }

  //     const mountTree = {};
  //     for (const [filename, value] of Object.entries(fileTree)) {
  //       if (value && value.file && typeof value.file.contents === "string") {
  //         mountTree[filename] = { file: { contents: value.file.contents } };
  //       }
  //     }
  //     await webContainer.mount(mountTree);

  //     if (mountTree["index.html"]) {
  //       if (webContainer.url) {
  //         setIframeUrl(webContainer.url);
  //       } else if (webContainer.getStaticServerUrl) {
  //         setIframeUrl(webContainer.getStaticServerUrl());
  //       } else {
  //         let htmlContent = mountTree["index.html"].file.contents;

  //         const cssLinks = Object.keys(mountTree)
  //           .filter((f) => f.endsWith(".css"))
  //           .map((f) => {
  //             const cssBlob = new Blob([mountTree[f].file.contents], {
  //               type: "text/css",
  //             });
  //             const cssUrl = URL.createObjectURL(cssBlob);
  //             return `<link rel="stylesheet" type="text/css" href="${cssUrl}">`;
  //           })
  //           .join("\n");

  //         const jsScripts = Object.keys(mountTree)
  //           .filter((f) => f.endsWith(".js"))
  //           .map((f) => {
  //             const jsBlob = new Blob([mountTree[f].file.contents], {
  //               type: "text/javascript",
  //             });
  //             const jsUrl = URL.createObjectURL(jsBlob);
  //             return `<script src="${jsUrl}"></script>`;
  //           })
  //           .join("\n");

  //         htmlContent = htmlContent.replace(/<head>/i, `<head>\n${cssLinks}`);
  //         if (/<\/body>/i.test(htmlContent)) {
  //           htmlContent = htmlContent.replace(
  //             /<\/body>/i,
  //             `${jsScripts}\n</body>`
  //           );
  //         } else {
  //           htmlContent += jsScripts;
  //         }

  //         const blob = new Blob([htmlContent], { type: "text/html" });
  //         const blobUrl = URL.createObjectURL(blob);
  //         setIframeUrl(blobUrl);
  //         console.warn(
  //           "No preview URL method found on webContainer, using Blob URL fallback with CSS/JS"
  //         );
  //       }
  //     } else {
  //       console.warn("No index.html found in fileTree for preview.");
  //     }
  //   } catch (error) {
  //     console.error("Error previewing static files:", error);
  //   }
  // }







  //  ************************************************
  
  


  // *****************************************************
  
   async function Preview(fileTree) {
  try {
    if (!fileTree["index.html"]) {
      console.warn("No index.html found.");
      return;
    }

    let htmlContent = fileTree["index.html"].file.contents;

    
    const cssLinks = Object.keys(fileTree)
      .filter(f => f.endsWith(".css"))
      .map(f => {
        const cssBlob = new Blob([fileTree[f].file.contents], { type: "text/css" });
        const cssUrl = URL.createObjectURL(cssBlob);
        return `<link rel="stylesheet" href="${cssUrl}">`;
      })
      .join("\n");

    // Inject JS
    const jsScripts = Object.keys(fileTree)
      .filter(f => f.endsWith(".js"))
      .map(f => {
        const jsBlob = new Blob([fileTree[f].file.contents], { type: "text/javascript" });
        const jsUrl = URL.createObjectURL(jsBlob);
        return `<script src="${jsUrl}"></script>`;
      })
      .join("\n");

    htmlContent = htmlContent.replace(/<head>/i, `<head>\n${cssLinks}`);
    htmlContent = htmlContent.replace(/<\/body>/i, `${jsScripts}\n</body>`);

    const blob = new Blob([htmlContent], { type: "text/html" });
    const blobUrl = URL.createObjectURL(blob);

    setIframeUrl(blobUrl);
  } catch (err) {
    console.error("Preview error:", err);
  }
}


  // *******************************************************************8

  // send message to project
  function sendMessageToProject() {
    sendingMessage("project-message", {
      message: sendMessage,
      sender: loginUser,
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: loginUser, message: sendMessage },
    ]);
    scrollToBottom();
    setsendMessage("");
  }

  function scrollToBottom() {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }

  function WriteAiMessage(message) {
    let messageObject;
    let markdownContent;

    console.log("AI message::", typeof message);
    if (typeof message === "string") {
      try {
         const text = message.replace(/^```json|```$/g, "").trim();
        const cleanJson = text.replace(/\\(?!["\\/bfnrtu])/g, '\\\\');
        const text2 = cleanJson.replace(/[\u200B-\u200D\uFEFF]/g, "");
        messageObject = JSON.parse(text2);
      } catch (error) {
        messageObject = message;
      }
    } else {
      messageObject = message;
    }

    // Ensure the content passed to Markdown is a string
    if (typeof messageObject === "object") {
      markdownContent =
        messageObject.text ||
        messageObject.message ||
        JSON.stringify(messageObject);
    } else {
      markdownContent = messageObject;
    }

    return (
      <div className="ai-message overflow-auto rounded-sm">
        <Markdown
          children={markdownContent}
          options={{
            overrides: {
              code: SyntaxHighlightedCode,
            },
          }}
        />
      </div>
    );
  }

  const updateProjectMembers = () => {
    axios
      .get(`/project/getProject/${project._id}`)
      .then((response) => {
        setProjectMembers(response.data.users);
        // console.log("Project members updated:", response.data.users);
      })
      .catch((error) => {
        console.error("Error updating project members:", error);
      });
  };

  const addCollaborator = () => {
    axios
      .put("/project/adduser", {
        users: selectedUserIds,
        projectid: project._id,
      })
      .then((response) => {
        updateProjectMembers(); // Update project members after adding collaborators
        // console.log("Collaborators added:", response.data);
      })
      .catch((error) => {
        console.error("Error adding collaborators:", error);
      });
  };

  const handleUserClick = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  return (
    <main className="h-screen w-screen flex">
      <section className="left  relative flex flex-col h-screen min-w-88 bg-slate-100">
        <header className="flex justify-between items-center bg-gray-800  w-full h-14 text-white absolute z-5 top-0 head-pro">
          <a href="http:/project">
            <i className="ri-arrow-left-s-line text-2xl ml-4"></i>
          </a>
          <button
            onClick={() => setIsModalOpen(true)}
            className="colaborator-button flex items-center gap-2 transition duration-300 rounded-full"
          >
            <i className="ri-user-add-fill text-sm"></i>
            <small className="text-xs">Add Colabarator</small>
          </button>

          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="header-user text-white rounded-full transition duration-300"
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>

        <div className="conversation flex-grow flex flex-col h-full pt-14 relative conversation-box">
          <div
            ref={messageBoxRef}
            className="message-box mt-14 flex-grow flex flex-col overflow-auto max-h-full scrollbar-hide "
          >
            {Messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col mt-4 px-4 bg-gray-200 rounded-md max-w-60 w-fit ${
                  msg.sender._id === "ai" ? "max-w-75 ai-box" : "max-w-52"
                } ${
                  msg.sender._id === loginUser._id.toString()
                    ? "ml-auto outgoing"
                    : "incoming"
                }  message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}
              >
                <small className="text-xs opacity-65">{msg.sender.email}</small>
                {/* <p className="text-xs">${msg.message}</p> */}
                <div className="text-sm">
                  {msg.sender._id === "ai" ? (
                    WriteAiMessage(msg.message)
                  ) : (
                    <p>{msg.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* --- */}

          <div className="inputmessage w-full flex absolute bottom-0 ">
            <input
              onChange={(e) => setsendMessage(e.target.value)}
              type="text"
              value={sendMessage}
              placeholder="message...."
              className="flex-grow 
                     px-4 border outline-none 
                    border-none
                    bg-gray-100 focus:outline-none  
                    message-in"
            />
            <button
              onClick={sendMessageToProject}
              className="text-slate-700 
                    text-4xl send-button transition duration-300"
            >
              <i className="ri-send-plane-2-fill"></i>
            </button>
          </div>
        </div>

        {/* sidepanel */}
        <div
          className={`sidePanel w-full h-full flex flex-col gap-2 bg-red-50 absolute transition-all bg-slate-100 z-10 ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          } top-0`}
        >
          <header className="flex justify-between items-center  bg-slate-200 side-header">
            <h4>Collaborator</h4>
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="p-2 hover:cursor-pointer "
            >
              <i className="ri-close-fill"></i>
            </button>
          </header>
          {/* user */}
          {projectMembers.map((user) => {
            return (
              <div
                key={user._id}
                className="user cursor-pointer hover:bg-slate-200  flex gap-2 items-center"
              >
                {/* user icon */}
                <div className="usericon bg-slate-600  flex items-center w-fit">
                  <i className="ri-user-fill"></i>
                </div>

                {/* username */}
                <div className="username text-sm text-gray-700">
                  {user.email == loginUser.email
                    ? user.email + " (You)"
                    : user.email}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Right Section */}

      <section className="Right-section flex flex grow h-full">
        <div className="explorer h-full max-w-48 min-w-30 bg-gray-200">
          <div className="file-tree w-full">
            {fileTree &&
              Object.keys(fileTree).map((file, index) => (
                <button
                  onClick={() => {
                    setcurrentfile(file);
                    setOpenedFiles((prev) =>
                      prev.includes(file) ? prev : [...prev, file]
                    );
                  }}
                  key={index}
                  className="tree-element flex items-center bg-gray-500 hover:bg-gray-300 cursor-pointer transition duration-300 w-full "
                >
                  <p className="file-name font-semibold">{file}</p>
                </button>
              ))}
          </div>
        </div>

        <div className="code-editor bg-gray-700 flex flex-col flex-grow h-full shrink">
          <div className="files flex justify-between w-full bg-white-800">
            <div className="top text-lg flex font-semibold  bg-gray-800 overflow-auto scrollbar-hidden ">
              {openedFiles.map((file, index) => (
                <button
                  onClick={() => {
                    setcurrentfile(file);
                  }}
                  key={index}
                  className={`open-file cursor-pointer min-w-32  flex items-center  w-fit gap-2  transition duration-300  ${
                    currentfile === file ? "dark-header" : "light-header"
                  }`}
                >
                  <p className="file-name font-semibold text-lg ">{file}</p>
                </button>
              ))}
            </div>

            <div className="actions flex gap-2">
              {isNPM == "None" && (
                <div className="preview">
                  <button
                    onClick={() => {
                      Preview(fileTree);
                    }}
                    className="run-button bg-red-700 text-white rounded hover:bg-red-800 cursor-pointer transition duration-300"
                  >
                    preview
                  </button>
                </div>
              )}

              {isNPM == "npm" && (
                <button
                  onClick={async () => {
                    try {
                      await webContainer.mount(fileTree);

                      if (runProcess) {
                        runProcess.kill();
                      }

                      if (!serverReadySet) {
                        webContainer.on("server-ready", (port, url) => {
                          console.log("Server ready at:", url);
                          setIframeUrl(url);
                        });
                        setServerReadySet(true);
                      }

                      const installProcess = await webContainer.spawn("npm", [
                        "install",
                      ]);
                      installProcess.output.pipeTo(
                        new WritableStream({
                          write(chunk) {
                            console.log("[install]", chunk);
                          },
                        })
                      );

                      const installExitCode = await installProcess.exit;
                      if (installExitCode !== 0) {
                        console.error("npm install failed");
                        return;
                      }

                      const startProcess = await webContainer.spawn("npm", [
                        "start",
                      ]);
                      startProcess.output.pipeTo(
                        new WritableStream({
                          write(chunk) {
                            console.log("[start]", chunk);
                          },
                        })
                      );

                      setRunProcess(startProcess); // Save the process so it can be killed later
                    } catch (err) {
                      console.error("Error running project:", err);
                    }
                  }}
                  className="run-button bg-red-700 text-white rounded hover:bg-red-800 cursor-pointer transition duration-300"
                >
                  Run
                </button>
              )}
            </div>
          </div>

          {/* bottom */}
          <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
            {fileTree[currentfile] && (
              <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
                <pre className="hljs h-full">
                  <code
                    className="hljs h-full codeContent outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const updatedContent = e.target.innerText;
                      const ft = {
                        ...fileTree,
                        [currentfile]: {
                          file: {
                            ...fileTree[currentfile].file,
                            contents: updatedContent,
                          },
                        },
                      };
                      setFileTree(ft);
                    }}
                    dangerouslySetInnerHTML={{
                      __html: (() => {
                        const filename = currentfile || "";
                        let language = "javascript";
                        if (filename.endsWith(".html")) language = "xml";
                        else if (filename.endsWith(".css")) language = "css";
                        else if (filename.endsWith(".json")) language = "json";
                        else if (filename.endsWith(".py")) language = "python";
                        else if (filename.endsWith(".java")) language = "java";
                        else if (filename.endsWith(".ts"))
                          language = "typescript";
                        else if (filename.endsWith(".jsx")) language = "jsx";
                        else if (filename.endsWith(".tsx")) language = "tsx";
                        // add more as needed
                        return hljs.highlight(
                          fileTree[currentfile]?.file?.contents || "",
                          { language }
                        ).value;
                      })(),
                    }}
                    style={{
                      whiteSpace: "pre-wrap",
                      paddingBottom: "25rem",
                      counterSet: "line-numbering",
                    }}
                  />
                </pre>
              </div>
            )}
          </div>
        </div>
      </section>

      {iframeUrl && webContainer && (
        <div className="flex resize-x min-w-110 flex-col h-full relative">
          <div className="address-bar flex items-center">
            <input
              type="text"
              onChange={(e) => setIframeUrl(e.target.value)}
              value={iframeUrl}
              className="url w-full bg-slate-700 text-white focus:outline-none"
            />
            <button
              className=" text-xl text-red-700 hover:text-red-600  cursor-pointer transition hover:bg-red-600 hover:text-white rounded-md "
              onClick={() => {
                setIframeUrl("");
                if (runProcess) {
                  runProcess.kill();
                  setRunProcess(null);
                }
              }}
              title="Stop Preview"
            >
              <i className="ri-close-line"></i>
            </button>
          </div>
          <iframe
            ref={previewRef}
            src={iframeUrl}
            className="iframe-container w-full h-full"
            title="Live Preview"
          ></iframe>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex  items-center justify-center bg-black/20 backdrop-blur-[0.6px]">
          <div className="bg-white h-80 rounded-xl shadow-lg w-72 min-h-[200px] flex flex-col justify-between pro-box ">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold select-user">
                Select Users
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 hover:cursor-pointer transition duration-300"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <div className="flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 overflow-y-auto">
              {userList.map((user) => (
                <div
                  key={user._id}
                  className={`flex items-center gap-3 p-3 rounded cursor-pointer mb-2 transition ${
                    selectedUserIds.includes(user._id)
                      ? "bg-blue-100 border border-blue-400"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleUserClick(user._id)}
                >
                  <div className="bg-slate-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    <i className="ri-user-fill"></i>
                  </div>
                  <span className="text-sm flex-1">{user.email}</span>
                  {selectedUserIds.includes(user._id) && (
                    <i className="ri-checkbox-circle-fill text-blue-500 text-lg"></i>
                  )}
                </div>
              ))}
            </div>
            <button
              className="mt-4 w-fit bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm select-user-btn"
              onClick={() => {
                addCollaborator();
                setIsModalOpen(false);
              }}
              disabled={selectedUserIds.length === 0}
            >
              Add Collaborator
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default OpenProject;
