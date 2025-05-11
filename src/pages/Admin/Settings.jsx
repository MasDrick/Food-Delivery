import React from "react";
import {
  Database,
  Server,
  Globe,
  Shield,
  Key,
  Settings as SettingsIcon,
  ExternalLink,
} from "lucide-react";
import s from "./Admin.module.scss";

const Settings = () => {
  return (
    <div className={s.settingsContent}>
      <h2>Настройки системы</h2>

      <div className={s.settingsGrid}>
        <div className={s.settingsCard}>
          <div className={s.settingsCardHeader}>
            <Database size={24} />
            <h3>База данных</h3>
          </div>
          <div className={s.settingsCardBody}>
            <p>
              Управление базой данных и доступ к инструментам администрирования.
            </p>
            <div className={s.settingsLinks}>
              <a
                href="http://localhost/phpmyadmin"
                target="_blank"
                rel="noopener noreferrer"
                className={s.settingsLink}
              >
                <span>Открыть phpMyAdmin</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className={s.settingsCard}>
          <div className={s.settingsCardHeader}>
            <Server size={24} />
            <h3>Сервер</h3>
          </div>
          <div className={s.settingsCardBody}>
            <p>Информация о сервере и системные настройки.</p>
            <div className={s.settingsInfo}>
              <div className={s.settingsInfoItem}>
                <span className={s.settingsInfoLabel}>Версия PHP:</span>
                <span className={s.settingsInfoValue}>8.1.0</span>
              </div>
              <div className={s.settingsInfoItem}>
                <span className={s.settingsInfoLabel}>Версия MySQL:</span>
                <span className={s.settingsInfoValue}>8.0.27</span>
              </div>
              <div className={s.settingsInfoItem}>
                <span className={s.settingsInfoLabel}>Сервер:</span>
                <span className={s.settingsInfoValue}>Apache/2.4.51</span>
              </div>
            </div>
          </div>
        </div>

        <div className={s.settingsCard}>
          <div className={s.settingsCardHeader}>
            <Globe size={24} />
            <h3>Сайт</h3>
          </div>
          <div className={s.settingsCardBody}>
            <p>Основные настройки сайта и SEO параметры.</p>
            <div className={s.settingsForm}>
              <div className={s.formGroup}>
                <label>Название сайта</label>
                <input type="text" defaultValue="React Food" />
              </div>
              <div className={s.formGroup}>
                <label>Описание сайта</label>
                <textarea defaultValue="Доставка еды из лучших ресторанов города"></textarea>
              </div>
              <button className={s.saveButton}>Сохранить</button>
            </div>
          </div>
        </div>

        <div className={s.settingsCard}>
          <div className={s.settingsCardHeader}>
            <Shield size={24} />
            <h3>Безопасность</h3>
          </div>
          <div className={s.settingsCardBody}>
            <p>Настройки безопасности и доступа к системе.</p>
            <div className={s.settingsOptions}>
              <div className={s.settingsOption}>
                <div>
                  <h4>Двухфакторная аутентификация</h4>
                  <p>Повышенная защита для администраторов</p>
                </div>
                <label className={s.toggle}>
                  <input type="checkbox" />
                  <span className={s.toggleSlider}></span>
                </label>
              </div>
              <div className={s.settingsOption}>
                <div>
                  <h4>Журнал действий</h4>
                  <p>Запись всех действий администраторов</p>
                </div>
                <label className={s.toggle}>
                  <input type="checkbox" defaultChecked />
                  <span className={s.toggleSlider}></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className={s.settingsCard}>
          <div className={s.settingsCardHeader}>
            <Key size={24} />
            <h3>API ключи</h3>
          </div>
          <div className={s.settingsCardBody}>
            <p>Управление API ключами для интеграций.</p>
            <div className={s.apiKeys}>
              <div className={s.apiKeyItem}>
                <div>
                  <h4>Платежная система</h4>
                  <div className={s.apiKeyValue}>
                    <input
                      type="password"
                      defaultValue="sk_test_51NcYT9JKSJfhgDFGjhgJHGjhg"
                      readOnly
                    />
                    <button className={s.showButton}>Показать</button>
                  </div>
                </div>
                <button className={s.regenerateButton}>Обновить</button>
              </div>
              <div className={s.apiKeyItem}>
                <div>
                  <h4>Сервис доставки</h4>
                  <div className={s.apiKeyValue}>
                    <input
                      type="password"
                      defaultValue="delivery_api_key_12345678"
                      readOnly
                    />
                    <button className={s.showButton}>Показать</button>
                  </div>
                </div>
                <button className={s.regenerateButton}>Обновить</button>
              </div>
            </div>
          </div>
        </div>

        <div className={s.settingsCard}>
          <div className={s.settingsCardHeader}>
            <SettingsIcon size={24} />
            <h3>Системные настройки</h3>
          </div>
          <div className={s.settingsCardBody}>
            <p>Дополнительные настройки системы.</p>
            <div className={s.settingsOptions}>
              <div className={s.settingsOption}>
                <div>
                  <h4>Режим обслуживания</h4>
                  <p>Временно закрыть сайт для посетителей</p>
                </div>
                <label className={s.toggle}>
                  <input type="checkbox" />
                  <span className={s.toggleSlider}></span>
                </label>
              </div>
              <div className={s.settingsOption}>
                <div>
                  <h4>Кэширование</h4>
                  <p>Ускорение работы сайта</p>
                </div>
                <label className={s.toggle}>
                  <input type="checkbox" defaultChecked />
                  <span className={s.toggleSlider}></span>
                </label>
              </div>
              <div className={s.settingsOption}>
                <div>
                  <h4>Отладка</h4>
                  <p>Режим разработчика</p>
                </div>
                <label className={s.toggle}>
                  <input type="checkbox" />
                  <span className={s.toggleSlider}></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
