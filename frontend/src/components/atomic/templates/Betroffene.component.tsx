import { BetroffeneList } from '../organisms/BetroffeneList.component.js';
import { PiRepeat } from 'react-icons/pi';
import { BetroffeneDetail, BetroffeneFeed, Patientenbox } from '../organisms/BetroffeneDetail.component.js';
import { Button } from 'antd';

export function BetroffeneTemplate() {
  return <div className="flex h-[calc(100vh-9rem)] overflow-hidden">
    <aside
      className="hidden xl:block w-96 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="h-full overflow-y-auto py-6">
        <h2 className="mb-2 text-lg px-4">Aufgenommene Betroffene</h2>
        <BetroffeneList />
      </div>
    </aside>
    <main className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto px-4 py-6 lg:px-8">
        <div className="grid flex-col grid-cols-6 lg:grid-cols-12 xl:grid-cols-6 2xl:grid-cols-12 gap-8">
          <div className="mb-2 text-lg px-2 col-span-6 lg:col-span-12 xl:col-span-6 2xl:col-span-12 flex">
            <h2 className="flex-auto">Details zur Person</h2>
            <div className="flex gap-2 flex-col md:flex-row">
              <Button
                onClick={() => {
                  //
                }}
                icon={<PiRepeat />} iconPosition={'end'}
              >Status wechseln</Button>
              <Button
                type="primary"
                onClick={() => {
                  //
                }}
                icon={<PiRepeat />} iconPosition={'end'}
              >Status wechseln</Button>
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
  </div>;

}