import { Brain, Database, Laptop, PaintRoller, Sparkle } from "lucide-react"
import React from "react"

export default function Features() {
  return (
    <section className="flex flex-col container p-4 sm:p-20 w-full">
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-full lg:col-span-2 overflow-hidden rounded-2xl border bg-background p-8">
          <div className="mx-auto flex items-center justify-center aspect-square size-32 rounded-full border">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="h-fit w-24 m-auto lucide lucide-lock"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div className="mt-8 text-center">
            <h2 className="text-lg font-medium text-foreground">
              Securely stored data
            </h2>
            <p className="text-muted-foreground">
              Your data is securely stored with SHA-256 in a Pinecone Vector
              database
            </p>
          </div>
        </div>
        <div className="col-span-full lg:col-span-2 overflow-hidden rounded-2xl border bg-background p-8">
          <div className="mx-auto flex items-center justify-center aspect-square size-32 rounded-full border">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
              width="24"
              height="24"
              viewBox="0 0 56 56"
              className="h-fit w-24 m-auto lucide lucide-lock"
            >
              <path d="M 10.3818 24.6783 C 8.4185 26.5960 8.5326 29.1529 10.6329 31.2303 L 15.1074 35.7505 C 12.7788 37.2344 8.2815 39.0607 6.1355 41.2067 C 2.7797 44.5626 2.8025 49.0828 6.2269 52.5300 C 9.6741 55.9543 14.1943 56 17.5502 52.6441 C 19.7189 50.4753 21.5224 45.9780 23.0063 43.6722 L 27.5721 48.1696 C 29.6496 50.2242 32.1836 50.3383 34.1241 48.3979 L 36.5669 45.8867 C 38.1192 44.2886 38.3703 42.3253 37.2518 40.5218 C 38.2562 40.2707 39.1922 39.7000 39.9228 38.9466 L 50.5381 28.2854 C 53.0722 25.7742 53.0039 22.7835 50.3787 20.1582 L 32.0010 1.7807 C 30.3573 .1598 28.1201 0 26.5905 1.5296 C 25.9056 2.2144 25.3805 3.1961 25.1066 4.5202 C 23.8738 10.1818 21.3854 15.4554 18.4633 19.1765 C 17.9611 19.8386 17.6186 20.4778 17.4588 21.1399 C 15.8836 20.5006 14.2399 20.8431 12.8702 22.1900 Z M 36.7267 37.0518 C 35.7678 37.9878 34.8775 37.9193 33.9187 36.9376 L 33.8958 36.9376 L 21.6137 24.6555 L 21.6366 24.6327 C 20.7462 23.7652 20.3353 22.8064 21.6137 20.9572 C 24.2619 17.1447 26.8873 11.9168 28.4397 6.0954 C 28.5310 5.8215 28.6452 5.5932 28.8506 5.3877 C 29.2159 4.9996 29.7181 4.8854 30.2203 5.4105 L 41.3153 16.4827 C 40.7218 20.2951 37.6855 24.0848 35.3569 26.4134 C 35.1286 26.6417 34.8319 26.9613 35.1971 27.3266 C 36.3386 28.4680 43.1873 23.5597 45.9726 21.1627 L 47.5935 22.7607 C 48.6890 23.8565 48.7119 25.0436 47.7305 26.0253 Z M 13.4637 26.8471 L 15.0389 25.2948 C 15.7467 24.6099 16.6826 24.5870 17.4132 25.3404 L 33.4393 41.3893 C 34.1469 42.1427 34.1698 43.0102 33.4621 43.7179 L 31.9553 45.2931 C 31.2248 46.0236 30.3117 46.0008 29.5811 45.2475 L 23.8282 39.5173 C 23.0291 38.6955 22.1160 39.0151 21.2941 40.0881 C 19.6276 42.4623 16.8196 48.4435 15.1531 50.0872 C 13.1898 52.0049 10.5872 52.0505 8.6468 50.1100 C 6.7063 48.1696 6.7291 45.5442 8.6696 43.6038 C 10.3133 41.9601 16.2945 39.1292 18.6916 37.4627 C 19.7418 36.6409 20.0842 35.7277 19.2395 34.9286 L 13.5094 29.2214 C 12.7788 28.5136 12.7560 27.5549 13.4637 26.8471 Z M 10.1763 48.6033 C 10.9297 49.3339 12.0255 49.3339 12.7560 48.6033 C 13.4866 47.8272 13.4637 46.7542 12.7560 46.0236 C 12.0027 45.2931 10.8840 45.2703 10.1763 46.0236 C 9.4915 46.7998 9.4458 47.8500 10.1763 48.6033 Z" />
            </svg>
          </div>
          <div className="mt-8 text-center">
            <h2 className="text-lg font-medium text-foreground">
              Unleash your Personality
            </h2>
            <p className="text-muted-foreground">
              Display your brand or personality in the best light with multiple
              customisation options
            </p>
          </div>
        </div>
        <div className="col-span-full lg:col-span-2 overflow-hidden rounded-2xl border bg-background p-8">
          <div>
            <div className="mx-auto flex items-center justify-center aspect-square size-32 rounded-full border">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="h-fit w-24 m-auto lucide lucide-lock"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M14 2C14 2.74028 13.5978 3.38663 13 3.73244V4H20C21.6569 4 23 5.34315 23 7V19C23 20.6569 21.6569 22 20 22H4C2.34315 22 1 20.6569 1 19V7C1 5.34315 2.34315 4 4 4H11V3.73244C10.4022 3.38663 10 2.74028 10 2C10 0.895431 10.8954 0 12 0C13.1046 0 14 0.895431 14 2ZM4 6H11H13H20C20.5523 6 21 6.44772 21 7V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V7C3 6.44772 3.44772 6 4 6ZM15 11.5C15 10.6716 15.6716 10 16.5 10C17.3284 10 18 10.6716 18 11.5C18 12.3284 17.3284 13 16.5 13C15.6716 13 15 12.3284 15 11.5ZM16.5 8C14.567 8 13 9.567 13 11.5C13 13.433 14.567 15 16.5 15C18.433 15 20 13.433 20 11.5C20 9.567 18.433 8 16.5 8ZM7.5 10C6.67157 10 6 10.6716 6 11.5C6 12.3284 6.67157 13 7.5 13C8.32843 13 9 12.3284 9 11.5C9 10.6716 8.32843 10 7.5 10ZM4 11.5C4 9.567 5.567 8 7.5 8C9.433 8 11 9.567 11 11.5C11 13.433 9.433 15 7.5 15C5.567 15 4 13.433 4 11.5ZM10.8944 16.5528C10.6474 16.0588 10.0468 15.8586 9.55279 16.1056C9.05881 16.3526 8.85858 16.9532 9.10557 17.4472C9.68052 18.5971 10.9822 19 12 19C13.0178 19 14.3195 18.5971 14.8944 17.4472C15.1414 16.9532 14.9412 16.3526 14.4472 16.1056C13.9532 15.8586 13.3526 16.0588 13.1056 16.5528C13.0139 16.7362 12.6488 17 12 17C11.3512 17 10.9861 16.7362 10.8944 16.5528Z"
                  fill="#000000"
                />
              </svg>
            </div>
            <div className="mt-8 text-center">
              <h2 className="text-lg font-medium text-foreground">
                Respond in your own way
              </h2>
              <p className="text-muted-foreground">
                Specify your AI personality, behaviour and autonomy levels
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:grid grid-cols-2 place-items-center gap-12 px-4 py-48">
        <img
          className="hidden lg:block border rounded-xl shadow-lg"
          src={
            "https://thumbs.dreamstime.com/b/jumping-american-short-hair-gray-cat-isolated-white-png-transparent-background-jumping-cat-isolated-288992474.jpg"
          }
        />

        <div className="flex flex-col gap-6">
          <span className="font-bold text-center text-3xl sm:text-4xl">
            Never miss a lead
          </span>
          <p className="text-center lg:text-center font-light max-w-[700px] lg:w-full">
            Answer potential clients instantly, receive instant notifications
            for inquiries
          </p>
          <div className="py-4 sm:py-0 flex flex-col items-center mx-auto gap-4 max-w-[500px] w-full">
            <div className="grid grid-cols-[auto_1fr] grid-flow-col place-items-center gap-6 w-full">
              <Database />
              <div className="flex flex-col items-center text-center">
                <p className="font-semibold">Plenty of Data</p>

                <p className="font-light">
                  Train your chatbot on up to 15MB of data
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[auto_1fr] grid-flow-col place-items-center gap-6 w-full">
              <Brain />
              <div className="flex flex-col text-center items-center">
                <p className="font-semibold">Multiple Data Types</p>
                <p className="font-light">
                  Import via pdf files or plain old text
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[auto_1fr] grid-flow-col place-items-center gap-6 w-full">
              <Laptop />
              <div className="flex flex-col text-center items-center">
                <p className="font-semibold">Instant Notifications</p>
                <p className="font-light">
                  Instant notifications via email when a user sends you an
                  inquiry
                </p>
              </div>
            </div>
          </div>
        </div>
        <img
          className="lg:hidden border rounded-xl shadow-lg"
          src={
            "https://thumbs.dreamstime.com/b/jumping-american-short-hair-gray-cat-isolated-white-png-transparent-background-jumping-cat-isolated-288992474.jpg"
          }
        />
      </div>

      <div className="flex flex-col lg:grid grid-cols-2 place-items-center gap-12 px-4 py-18">
        <div className="flex flex-col gap-6 lg:text-right">
          <span className="font-bold text-center text-3xl sm:text-4xl">
            Your page, your style
          </span>
          <p className="text-center lg:text-center font-light max-w-[700px] lg:w-full">
            Personalise your page to fit your personality! Choose from multiple
            layouts and styling options
          </p>
          <div className="py-4 sm:py-0 flex flex-col items-center mx-auto gap-4 max-w-[500px] w-full">
            <div className="grid grid-cols-[auto_1fr] grid-flow-col place-items-center gap-6 w-full">
              <Sparkle />
              <div className="flex flex-col items-center text-center">
                <p className="font-semibold">Responsive Design</p>
                <p className="font-light">
                  Your page looks crisp, regardless of the device
                </p>
              </div>
            </div>
            <div className="grid grid-cols-[auto_1fr] grid-flow-col place-items-center gap-6 w-full">
              <PaintRoller />
              <div className="flex flex-col items-center text-center">
                <p className="font-semibold">Enhanced Customisation</p>
                <p className="font-light">
                  Say goodbye to boring. With 20+ customisation options, your
                  page will always pop.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-[auto_1fr] grid-flow-col place-items-center gap-6 w-full">
              <Sparkle />
              <div className="flex flex-col items-center text-center">
                <p className="font-semibold">Responsive Design</p>
                <p className="font-light">
                  Your page looks crisp, regardless of the device
                </p>
              </div>
            </div>
          </div>
        </div>
        <img
          className="border rounded-xl shadow-lg"
          src={
            "https://thumbs.dreamstime.com/b/jumping-american-short-hair-gray-cat-isolated-white-png-transparent-background-jumping-cat-isolated-288992474.jpg"
          }
        />
      </div>
    </section>
  )
}
