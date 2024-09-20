import { BetroffeneList } from '../organisms/BetroffeneList.component.js';
import { PiRepeat } from 'react-icons/pi';
import { BetroffeneDetail, BetroffeneFeed, Patientenbox } from '../organisms/BetroffeneDetail.component.js';
import { Button } from 'antd';

export function BetroffeneTemplate() {
  return (
    <div className="flex h-[calc(100vh-9rem)] overflow-hidden">
      <aside className="hidden w-96 flex-shrink-0 overflow-hidden border-r border-gray-200 xl:block dark:border-gray-700">
        <div className="h-full overflow-y-auto py-6">
          <h2 className="mb-2 px-4 text-lg">Aufgenommene Betroffene</h2>
          <BetroffeneList />
        </div>
      </aside>
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-4 py-6 lg:px-8">
          <div className="grid grid-cols-6 flex-col gap-8 lg:grid-cols-12 xl:grid-cols-6 2xl:grid-cols-12">
            <div className="col-span-6 mb-2 flex px-2 text-lg lg:col-span-12 xl:col-span-6 2xl:col-span-12">
              <h2 className="flex-auto">Details zur Person</h2>
              <div className="flex flex-col gap-2 md:flex-row">
                <Button
                  onClick={() => {
                    //
                  }}
                  icon={<PiRepeat />}
                  iconPosition={'end'}
                >
                  Status wechseln
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    //
                  }}
                  icon={<PiRepeat />}
                  iconPosition={'end'}
                >
                  Status wechseln
                </Button>
              </div>
            </div>
            <div className="col-span-6">
              <BetroffeneDetail />
            </div>
            <div className="col-span-6 flex flex-col gap-8">
              <Patientenbox />
              <BetroffeneFeed />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
