import { useEffect, useState } from "react";
import BackgroundCanvas from "../components/backgroundCanvas";
import toast from "react-hot-toast";

const linkRegex = /^(http|https):\/\/[^ "]+$/;

const MainPage = () => {
  const [link, setLink] = useState<string>("");
  const [isLinkValid, setIsLinkValid] = useState<boolean>(false);
  const [linkId, setLinkId] = useState<string>("");

  const _API_GET_LINK = async () => {
    if (!isLinkValid) return;
    if (link.length === 0) return;

    return new Promise<{
      status: number;
      id?: string;
      error?: string;
    }>(async (resolve, reject) => {
      const response = await fetch("/api/create", {
        method: "POST",
        body: JSON.stringify({
          url: link.includes("http") ? link : `https://${link}`,
        }),
      });

      const data = await response.json();

      if (data.status === 200) {
        console.log(data.id);
        return resolve(data);
      } else {
        return reject(data);
      }
    });
  };

  const GetLink = () => {
    const promise = _API_GET_LINK();

    toast.promise(promise, {
      error: (data) => {
        return data.error as string;
      },
      loading: "shortening link...",
      success: (data) => {
        if (!data || !data.id) return "error shortening link!";
        setLinkId(data.id as string);
        return "link shortened!";
      },
    });
  };

  useEffect(() => {
    setIsLinkValid(linkRegex.test(link));
  }, [link]);
  return (
    <BackgroundCanvas>
      <div className="w-screen h-screen bg-black/50 relative z-[60] pointer-events-none">
        <div className="p-4 text-white pointer-events-auto">
          <div className="w-full flex justify-center items-center pt-4">
            <img
              src="/rmshortify.png"
              className="w-full max-w-[556px] h-auto"
            />
          </div>

          {linkId.length > 0 && (
            <div className="w-full flex justify-center items-center pt-4">
              <p
                className="inter-bold cursor-pointer"
                onClick={() => {
                  // copy link to clipboard
                  navigator.clipboard.writeText(
                    `https://iwantyouin.me/u/${linkId}`,
                  );
                  toast.success("link copied to clipboard!");
                }}
              >
                your link. https://iwantyouin.me/u/{linkId}
              </p>
            </div>
          )}

          <div className="w-full flex justify-center items-center pt-4">
            <p className="inter-bold">enter a link.</p>
          </div>
          <div className="w-full flex justify-center items-center pt-1">
            <input
              value={link}
              onChange={(event) => {
                setLink(event.target.value);
              }}
              className={`${isLinkValid ? "text-blue-400" : "text-white"} inter p-2 pointer-events-auto w-96 bg-black border-2 focus:outline-none focus:ring-0`}
            />
          </div>

          <div className="w-full flex justify-center items-center pt-5">
            <button
              onClick={() => {
                GetLink();
              }}
              className="p-2 rounded-xl inter border border-[#C22DC2] bg-[#C22DC2]/10"
            >
              get link.
            </button>
          </div>
        </div>
      </div>

      <div className="absolute pr-2 pb-1 bottom-0 right-0 z-[2000] select-none text-white">
        <p className="inter">
          get your link the fastest and the biggest by sharing it around.
        </p>
      </div>
    </BackgroundCanvas>
  );
};

export default MainPage;
